"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { orderServices } from "@/services/order";
import type { Order } from "../columns";
import { statusMap, DEFAULT_STATUS_CONFIG } from "../columns";

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="col-span-2 font-medium">{value || "-"}</span>
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await orderServices.getOrderById(params.id);
        setOrder(result.data.data as unknown as Order);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Gagal memuat data order. Order mungkin tidak ditemukan.");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) fetchOrder();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Memuat data order...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="px-5 py-10">
        <p className="text-sm text-red-500">
          {error ?? "Order tidak ditemukan."}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/admin/orders")}
        >
          Kembali ke daftar order
        </Button>
      </div>
    );
  }

  const statusConfig = statusMap[order.status] ?? DEFAULT_STATUS_CONFIG;

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
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              {order.order_number || order.id}
            </h1>
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          </div>
          <p className="text-muted-foreground">
            Dibuat pada {formatDate(order.created_at)}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/orders")}>
          Kembali
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Client</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow label="Nama" value={order.client?.name} />
            <InfoRow label="Email" value={order.client?.email} />
            <InfoRow label="WhatsApp" value={order.client?.phone} />
            <InfoRow label="Kota" value={order.client?.city} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paket & Jenis Website</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow label="Paket" value={order.package?.name} />
            <InfoRow label="Jenis Website" value={order.website_type?.name} />
            <InfoRow label="Status Pembayaran" value={order.payment?.status} />
            <InfoRow
              label="Total Harga"
              value={
                order.payment?.totalPrice
                  ? `Rp ${order.payment.totalPrice.toLocaleString("id-ID")}`
                  : "Belum ditentukan"
              }
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Project</CardTitle>
        </CardHeader>
        <CardContent>
          <InfoRow label="Nama Project" value={order.project?.name} />
          <InfoRow label="Jenis Pemilik" value={order.project?.ownerType} />
          <Separator className="my-2" />
          <div className="py-2 text-sm">
            <p className="mb-1 text-muted-foreground">Deskripsi</p>
            <p className="font-medium">{order.project?.description || "-"}</p>
          </div>
          <div className="py-2 text-sm">
            <p className="mb-1 text-muted-foreground">Tujuan Project</p>
            <p className="font-medium">{order.project?.goal || "-"}</p>
          </div>
          <InfoRow
            label="Informasi Kontak"
            value={order.project?.informationContact}
          />
          <InfoRow
            label="Lokasi Layanan"
            value={order.project?.serviceLocation}
          />
        </CardContent>
      </Card>

      {order.additionalNote && (
        <Card>
          <CardHeader>
            <CardTitle>Catatan Tambahan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{order.additionalNote}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
