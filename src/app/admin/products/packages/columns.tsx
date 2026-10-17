"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EditPackagesDialog } from "@/components/views/admin/products/packages/edit-packages-dialog";
import { DeletePackagesDialog } from "@/components/views/admin/products/packages/delete-packages-dialog";
import { formatRupiah } from "@/lib/utils/rupiah";

export type Package = {
  id: string;
  name: string;
  price: string;
  target: string[];
  features: string[];
  duration_min_days: number;
  duration_max_days: number;
  created_at?: string;
  updated_at?: Date;
};

export const packageColumns = (
  onRefresh?: () => void,
): ColumnDef<Package>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
  },
  {
    accessorKey: "name",
    header: "Nama Paket",
  },
  {
    accessorKey: "price",
    header: "Harga",
    cell: ({ row }) => {
      const price = row.original.price;

      return (
        <div className="flex flex-col">
          <span>{formatRupiah(price)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "target",
    header: "Target Pengguna",
    cell: ({ row }) => (
      <ul className="list-disc ml-5">
        {row.original.target?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    ),
  },
  {
    accessorKey: "features",
    header: "Fitur",
    cell: ({ row }) => (
      <ul className="list-disc ml-5">
        {row.original.features?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    ),
  },
  {
    accessorKey: "duration",
    header: "Durasi",
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <EditPackagesDialog data={row.original} onRefresh={onRefresh} />
        <DeletePackagesDialog data={row.original} onRefresh={onRefresh} />
      </div>
    ),
  },
];
