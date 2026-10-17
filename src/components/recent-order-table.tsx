"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dashboardServices } from "@/services/dashboard";
import {
  statusMap,
  DEFAULT_STATUS_CONFIG,
  type Order,
} from "@/app/admin/orders/columns";

export function RecentOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await dashboardServices.getStats();
        setOrders(result.data.data.recentOrders);
      } catch (error) {
        console.error("Failed to fetch recent orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (ts: { seconds?: number } | null | undefined) =>
    ts?.seconds
      ? new Date(ts.seconds * 1000).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        })
      : "-";

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Order Terbaru</CardTitle>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              Lihat Semua
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Paket</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Memuat...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Belum ada order.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => {
                  const config =
                    statusMap[order.status] ?? DEFAULT_STATUS_CONFIG;
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {order.project?.name || order.order_number}
                        </Link>
                      </TableCell>
                      <TableCell>{order.client?.name || "-"}</TableCell>
                      <TableCell>{order.package?.name || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(order.created_at)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
