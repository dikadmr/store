"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orderServices } from "@/services/order";
import { paymentServices } from "@/services/payment";
import type { Order } from "@/app/admin/orders/columns";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

interface SnapWindow extends Window {
  snap?: {
    pay: (
      token: string,
      callbacks: {
        onSuccess?: () => void;
        onPending?: () => void;
        onError?: () => void;
        onClose?: () => void;
      },
    ) => void;
  };
}

export default function OrderPaymentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      const result = await orderServices.getOrderById(params.id);
      setOrder(result.data.data);
    } catch (err) {
      console.error("Gagal memuat order:", err);
      setError("Order tidak ditemukan.");
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Polling status — webhook mengupdate order di background,
  // halaman ini menunggu perubahan status tanpa perlu refresh manual.
  useEffect(() => {
    if (!order || order.status !== "WAITING_PAYMENT") return;

    const interval = setInterval(async () => {
      try {
        const result = await orderServices.getOrderById(params.id);
        if (result.data.data.status !== "WAITING_PAYMENT") {
          setOrder(result.data.data);
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [order, params.id]);

  const handlePay = async () => {
    setError(null);

    const snapWindow = typeof window !== "undefined" ? (window as unknown as SnapWindow) : null;
    if (!snapWindow?.snap) {
      setError(
        "Skrip pembayaran belum siap. Tunggu beberapa detik lalu coba lagi, atau refresh halaman.",
      );
      return;
    }

    setIsPaying(true);

    try {
      const result = await paymentServices.createTransaction(params.id);
      const { token } = result.data.data;

      snapWindow.snap.pay(token, {
        onSuccess: () => fetchOrder(),
        onPending: () => fetchOrder(),
        onError: () =>
          setError("Pembayaran gagal diproses. Silakan coba lagi."),
        onClose: () => setIsPaying(false),
      });
    } catch (err: unknown) {
      console.error("Gagal memulai pembayaran:", err);
      let message = "Gagal memulai pembayaran. Coba lagi.";
      if (typeof err === "object" && err !== null) {
        const errObj = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        if (errObj.response?.data?.message) {
          message = errObj.response.data.message;
        } else if (errObj.message) {
          message = errObj.message;
        }
      }
      setError(message);
      setIsPaying(false);
    }
  };

  return (
    <>
      {/* Script dirender selalu (termasuk saat isLoading/!order) supaya proses
          load snap.js paralel dengan fetch order, bukan menunggu urutan. */}
      <Script
        src={
          process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js"
        }
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={() =>
          setError("Gagal memuat skrip pembayaran. Cek koneksi internet Anda.")
        }
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          Memuat data order...
        </div>
      ) : !order ? (
        <div className="px-5 py-16 text-center text-red-500">
          {error || "Order tidak ditemukan."}
        </div>
      ) : (
        <div className="mx-auto max-w-lg space-y-6 px-5 py-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>
                {order.status === "WAITING_PAYMENT" && "Menunggu Pembayaran"}
                {order.status === "APPROVED" && "Pembayaran Berhasil!"}
                {order.status === "CANCELLED" && "Pesanan Dibatalkan"}
                {!["WAITING_PAYMENT", "APPROVED", "CANCELLED"].includes(
                  order.status,
                ) && "Status Pesanan"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                Order: <span className="font-mono">{order.order_number}</span>
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(order.payment?.totalPrice || 0)}
              </p>

              {order.status === "WAITING_PAYMENT" && (
                <>
                  <p className="text-sm text-muted-foreground">
                    Selesaikan pembayaran untuk mengonfirmasi pesanan Anda.
                    Status akan otomatis diperbarui begitu pembayaran berhasil.
                  </p>
                  <Button
                    className="w-full"
                    onClick={handlePay}
                    disabled={isPaying || !scriptLoaded}
                  >
                    {isPaying ? "Memproses..." : "Bayar Sekarang"}
                  </Button>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </>
              )}

              {order.status === "APPROVED" && (
                <>
                  <p className="text-sm text-muted-foreground">
                    Terima kasih! Pesanan Anda sudah dikonfirmasi dan akan
                    segera dikerjakan tim kami.
                  </p>
                  <Button className="w-full" onClick={() => router.push("/")}>
                    Kembali ke Beranda
                  </Button>
                </>
              )}

              {order.status === "CANCELLED" && (
                <p className="text-sm text-muted-foreground">
                  Pesanan ini telah dibatalkan. Silakan hubungi kami jika ini
                  adalah kesalahan.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
