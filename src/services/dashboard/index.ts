import instance from "@/lib/axios/instance";
import type { Order } from "@/app/admin/orders/columns";

export interface DashboardStats {
  totalOrders: number;
  ordersThisMonth: number;
  orderGrowth: number | null;
  totalClients: number;
  clientsThisMonth: number;
  clientGrowth: number | null;
  activeProjects: number;
  totalProjects: number;
  totalRevenue: number;
  ordersOverTime: { date: string; orders: number }[];
  recentOrders: Order[];
}

export const dashboardServices = {
  getStats: () =>
    instance.get<{ status: boolean; data: DashboardStats }>("/api/dashboard"),
};
