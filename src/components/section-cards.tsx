"use client";

import { useEffect, useState } from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dashboardServices, type DashboardStats } from "@/services/dashboard";

function GrowthBadge({ value }: { value: number | null }) {
  if (value === null) {
    return <Badge variant="outline">Baru</Badge>;
  }
  const isUp = value >= 0;
  return (
    <Badge variant="outline">
      {isUp ? <IconTrendingUp /> : <IconTrendingDown />}
      {isUp ? "+" : ""}
      {value.toFixed(1)}%
    </Badge>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function SectionCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await dashboardServices.getStats();
        setStats(result.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="@container/card animate-pulse">
            <CardHeader>
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="mt-2 h-8 w-32 rounded bg-muted" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Order Bulan Ini</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.ordersThisMonth}
          </CardTitle>
          <CardAction>
            <GrowthBadge value={stats.orderGrowth} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Total {stats.totalOrders} order sepanjang waktu
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Client Baru</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.clientsThisMonth}
          </CardTitle>
          <CardAction>
            <GrowthBadge value={stats.clientGrowth} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Total {stats.totalClients} client terdaftar
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Project Aktif</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.activeProjects}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Dari {stats.totalProjects} total project
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(stats.totalRevenue)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Dari order berstatus terbayar
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
