"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { statusMap, DEFAULT_STATUS_CONFIG } from "@/app/admin/orders/columns";
import type { Order } from "@/services/order";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(ts: Order["created_at"]) {
  if (!ts?.seconds) return "-";
  return new Date(ts.seconds * 1000).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function TabsOrder({
  orders,
  isLoading,
}: {
  orders: Order[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Memuat data order...
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Anda belum memiliki riwayat order.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const config = statusMap[order.status] ?? DEFAULT_STATUS_CONFIG;
        const needsPayment = order.status === "WAITING_PAYMENT";

        return (
          <Card key={order.id}>
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">
                    {order.project?.name || order.order_number}
                  </p>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {order.package?.name} · {formatDate(order.created_at)}
                </p>
                <p className="mt-0.5 text-sm font-medium">
                  {formatCurrency(order.payment?.totalPrice || 0)}
                </p>
              </div>

              {needsPayment && (
                <Link href={`/order/${order.id}/payment`} className="shrink-0">
                  <Button size="sm" className="w-full sm:w-auto">
                    Lanjutkan Pembayaran
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
