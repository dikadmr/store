import { retrieveData } from "@/lib/firebase/service";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helper";

interface DashboardOrder {
  id: string;
  created_at?: unknown;
  status?: string;
  payment?: {
    status?: string;
    totalPrice?: number;
  };
  [key: string]: unknown;
}

interface DashboardClient {
  id: string;
  created_at?: unknown;
  [key: string]: unknown;
}

interface DashboardProject {
  id: string;
  status?: string;
  [key: string]: unknown;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function toDate(ts: unknown): Date | null {
  if (!ts) return null;
  if (
    typeof ts === "object" &&
    ts !== null &&
    "seconds" in ts &&
    typeof (ts as { seconds: unknown }).seconds === "number"
  ) {
    return new Date((ts as { seconds: number }).seconds * 1000);
  }
  if (typeof ts === "string" || typeof ts === "number" || ts instanceof Date) {
    const d = new Date(ts);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function calcGrowth(current: number, previous: number): number | null {
  if (previous === 0) return null; // hindari pembagian nol -> Infinity/NaN
  return ((current - previous) / previous) * 100;
}

export async function GET() {
  try {
    const [orders, clients, projects] = await Promise.all([
      retrieveData("orders"),
      retrieveData("clients"),
      retrieveData("projects"),
    ]);

    const ordersArr = (orders as DashboardOrder[]) || [];
    const clientsArr = (clients as DashboardClient[]) || [];
    const projectsArr = (projects as DashboardProject[]) || [];

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
    );

    const ordersThisMonth = ordersArr.filter((o) => {
      const d = toDate(o.created_at);
      return d && d >= thisMonthStart;
    });
    const ordersLastMonth = ordersArr.filter((o) => {
      const d = toDate(o.created_at);
      return d && d >= lastMonthStart && d < thisMonthStart;
    });

    const clientsThisMonth = clientsArr.filter((c) => {
      const d = toDate(c.created_at);
      return d && d >= thisMonthStart;
    });
    const clientsLastMonth = clientsArr.filter((c) => {
      const d = toDate(c.created_at);
      return d && d >= lastMonthStart && d < thisMonthStart;
    });

    const activeProjects = projectsArr.filter(
      (p) => p.status === "in_progress",
    );

    const totalRevenue = ordersArr
      .filter((o) => o.payment?.status === "PAID")
      .reduce((sum, o) => sum + (o.payment?.totalPrice || 0), 0);

    // Order per hari, 90 hari terakhir
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const dailyCount = new Map<string, number>();
    ordersArr.forEach((o) => {
      const d = toDate(o.created_at);
      if (!d || d < ninetyDaysAgo) return;
      const key = d.toISOString().split("T")[0];
      dailyCount.set(key, (dailyCount.get(key) || 0) + 1);
    });

    const ordersOverTime = Array.from(dailyCount.entries())
      .map(([date, count]) => ({ date, orders: count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const recentOrders = [...ordersArr]
      .sort(
        (a, b) =>
          (toDate(b.created_at)?.getTime() || 0) -
          (toDate(a.created_at)?.getTime() || 0),
      )
      .slice(0, 8);

    return NextResponse.json({
      status: true,
      data: {
        totalOrders: ordersArr.length,
        ordersThisMonth: ordersThisMonth.length,
        orderGrowth: calcGrowth(ordersThisMonth.length, ordersLastMonth.length),
        totalClients: clientsArr.length,
        clientsThisMonth: clientsThisMonth.length,
        clientGrowth: calcGrowth(
          clientsThisMonth.length,
          clientsLastMonth.length,
        ),
        activeProjects: activeProjects.length,
        totalProjects: projectsArr.length,
        totalRevenue,
        ordersOverTime,
        recentOrders,
      },
    });
  } catch (error) {
    return handleApiError("GET /api/dashboard", error);
  }
}
