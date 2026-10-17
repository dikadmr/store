"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Payment = {
  id_payment: string;
  id_order: string;
  nama_client: string;
  paket: string;
  metode_pembayaran: string;
  jumlah_bayar: number;
  tanggal_bayar: string;
  status_pembayaran: string;
  bukti_pembayaran?: string;
  aksi: string;
};

export const paymentColumns: ColumnDef<Payment>[] = [
  { accessorKey: "id_payment", header: "ID Payment" },
  { accessorKey: "id_order", header: "Order ID" },
  { accessorKey: "nama_client", header: "Nama Client" },
  { accessorKey: "paket", header: "Paket" },
  { accessorKey: "metode_pembayaran", header: "Metode" },
  {
    accessorKey: "jumlah_bayar",
    header: "Jumlah Bayar",
    cell: ({ row }) => {
      const value = row.getValue("jumlah_bayar") as number;
      return `Rp ${value.toLocaleString("id-ID")}`;
    },
  },
  { accessorKey: "tanggal_bayar", header: "Tanggal Bayar" },
  { accessorKey: "status_pembayaran", header: "Status" },
  { accessorKey: "bukti_pembayaran", header: "Bukti Pembayaran" },
  { accessorKey: "aksi", header: "Aksi" },
];
