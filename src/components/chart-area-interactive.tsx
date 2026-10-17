"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { dashboardServices } from "@/services/dashboard";

const chartConfig = {
  orders: { label: "Order", color: "var(--primary)" },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");
  const [data, setData] = React.useState<{ date: string; orders: number }[]>(
    [],
  );
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d");
  }, [isMobile]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dashboardServices.getStats();
        setData(result.data.data.ordersOverTime);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = React.useMemo(() => {
    const daysToSubtract =
      timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return data.filter((item) => new Date(item.date) >= startDate);
  }, [data, timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Order Masuk</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Jumlah order per hari
          </span>
          <span className="@[540px]/card:hidden">Order per hari</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(v) => v && setTimeRange(v)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">3 bulan</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 hari</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 hari</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="flex w-32 @[767px]/card:hidden" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d">3 bulan</SelectItem>
              <SelectItem value="30d">30 hari</SelectItem>
              <SelectItem value="7d">7 hari</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex h-62.5 items-center justify-center text-sm text-muted-foreground">
            Memuat data...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex h-62.5 items-center justify-center text-sm text-muted-foreground">
            Belum ada order pada rentang ini.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-62.5 w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-orders)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-orders)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("id-ID", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("id-ID", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="orders"
                type="natural"
                fill="url(#fillOrders)"
                stroke="var(--color-orders)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
