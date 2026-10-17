"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clientServices, type Client } from "@/services/client";
import { orderServices } from "@/services/order";
import {
  statusMap,
  DEFAULT_STATUS_CONFIG,
  type Order,
} from "@/app/admin/orders/columns";

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="col-span-2 font-medium">{value || "-"}</span>
    </div>
  );
}

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [client, setClient] = useState<Client | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [clientData, ordersResponse] = await Promise.all([
          clientServices.getClientById(params.id),
          orderServices.getOrdersByClient(params.id),
        ]);

        setClient(clientData);
        setOrders(ordersResponse.data.data || []);
      } catch (err) {
        console.error("Failed to fetch client detail:", err);
        setError("Gagal memuat data client. Client mungkin tidak ditemukan.");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) fetchData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Memuat data client...
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="px-5 py-10">
        <p className="text-sm text-red-500">
          {error ?? "Client tidak ditemukan."}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/admin/clients")}
        >
          Kembali ke daftar client
        </Button>
      </div>
    );
  }

  const formatDate = (ts: { seconds: number } | null | undefined) =>
    ts
      ? new Date(ts.seconds * 1000).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-";

  return (
    <div className="space-y-6 px-5 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{client.name || "-"}</h1>
          <p className="text-muted-foreground">
            Terdaftar pada {formatDate(client.created_at)}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/clients")}>
          Kembali
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Kontak</CardTitle>
        </CardHeader>
        <CardContent>
          <InfoRow label="Email" value={client.email} />
          <InfoRow label="No. WhatsApp" value={client.phone} />
          <InfoRow label="Kota" value={client.city} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Order</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Client ini belum memiliki order.
            </p>
          ) : (
            <div className="space-y-2">
              {orders.map((order) => {
                const config = statusMap[order.status] ?? DEFAULT_STATUS_CONFIG;
                return (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between rounded-md border border-border p-3 hover:bg-muted/40"
                  >
                    <div>
                      <p className="font-medium">
                        {order.project?.name || order.order_number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.package?.name} · {order.website_type?.name}
                      </p>
                    </div>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
