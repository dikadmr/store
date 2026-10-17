// src/constants/order-status.ts

// Satu-satunya tempat status order didefinisikan. Backend (validasi PUT),
// dropdown filter admin, badge status, dan dialog edit semua mengimpor dari
// sini — supaya tidak ada lagi status "usang" yang nyasar ke satu tempat
// tapi tidak ke tempat lain.
export const ORDER_STATUSES = [
  "WAITING_PAYMENT",
  "APPROVED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<
  OrderStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  WAITING_PAYMENT: { label: "Menunggu Pembayaran", variant: "outline" },
  APPROVED: { label: "Disetujui / Dibayar", variant: "default" },
  IN_PROGRESS: { label: "Dikerjakan", variant: "default" },
  COMPLETED: { label: "Selesai", variant: "secondary" },
  CANCELLED: { label: "Dibatalkan", variant: "destructive" },
};

export const DEFAULT_STATUS_CONFIG = {
  label: "Tidak Diketahui",
  variant: "outline" as const,
};
