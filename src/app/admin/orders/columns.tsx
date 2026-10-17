"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditOrdersDialog } from "@/components/views/admin/orders/edit-orders-dialog";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { IconInfoCircle } from "@tabler/icons-react";

type FirestoreTimestamp = {
  seconds: number;
  nanoseconds: number;
};

export type OrderStatus =
  | "PENDING_CONFIRMATION"
  | "APPROVED"
  | "WAITING_PAYMENT"
  | "PAID"
  | "IN_PROGRESS"
  | "REVISION"
  | "COMPLETED"
  | "CANCELLED";

export type Order = {
  id: string;
  order_number: string;
  user_id: string | null;

  client_id: string;
  project_id: string;

  client?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    city?: string;
  } | null;

  project?: {
    name: string;
    ownerType: string;
    description: string;
    goal: string;
    informationContact: string;
    serviceLocation: string;
  } | null;

  package: { id: string; name: string };
  website_type: { id: string; name: string; slug: string };

  additionalNote?: string;
  status: OrderStatus;

  payment: {
    status: "UNPAID" | "WAITING_VERIFICATION" | "PAID";
    totalPrice: number;
  };

  created_at: FirestoreTimestamp | null;
  updated_at: FirestoreTimestamp | null;
};

export const statusMap: Record<
  OrderStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDING_CONFIRMATION: { label: "Menunggu Konfirmasi", variant: "secondary" },
  APPROVED: { label: "Disetujui", variant: "default" },
  WAITING_PAYMENT: { label: "Menunggu Pembayaran", variant: "outline" },
  PAID: { label: "Sudah Dibayar", variant: "default" },
  IN_PROGRESS: { label: "Dikerjakan", variant: "default" },
  REVISION: { label: "Revisi", variant: "outline" },
  COMPLETED: { label: "Selesai", variant: "secondary" },
  CANCELLED: { label: "Dibatalkan", variant: "destructive" },
};

export const DEFAULT_STATUS_CONFIG = {
  label: "Tidak Diketahui",
  variant: "outline" as const,
};

export const orderColumns = (onRefresh?: () => void): ColumnDef<Order>[] => [
  {
    accessorKey: "order_number",
    header: "ID Order",
    cell: ({ row }) => (
      <Link
        href={`/admin/orders/${row.original.id}`}
        className="font-mono text-blue-600 hover:underline"
      >
        {row.original.order_number || row.original.id}
      </Link>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Tanggal Order",
    cell: ({ row }) => {
      const date = row.original.created_at;
      return date
        ? new Date(date.seconds * 1000).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "-";
    },
  },
  {
    id: "clientName",
    accessorFn: (row) => row.client?.name ?? "",
    header: "Client",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.client?.name || "-"}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.client?.email}
        </span>
        <span className="text-xs text-muted-foreground">
          {row.original.client?.phone}
        </span>
      </div>
    ),
  },
  {
    id: "projectName",
    accessorFn: (row) => row.project?.name ?? "",
    header: "Nama Project",
    cell: ({ row }) => (
      <div className="max-w-52 truncate" title={row.original.project?.name}>
        {row.original.project?.name || "-"}
      </div>
    ),
  },
  {
    accessorKey: "package.name",
    header: "Paket",
    cell: ({ row }) => row.original.package?.name || "-",
  },
  {
    accessorKey: "website_type.name",
    header: "Tipe Website",
    cell: ({ row }) => row.original.website_type?.name || "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const config = statusMap[status] ?? DEFAULT_STATUS_CONFIG;
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    id: "aksi",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link href={`/admin/orders/${row.original.id}`}>
          <Button className="bg-blue-500" size="sm">
            <IconInfoCircle className="h-4 w-4" /> Detail
          </Button>
        </Link>
        <EditOrdersDialog data={row.original} onRefresh={onRefresh} />
      </div>
    ),
  },
];
