"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { EditWebtypesDialog } from "@/components/views/admin/products/websitetype/edit-websites-dialog";
import { DeleteWebtypesDialog } from "@/components/views/admin/products/websitetype/delete-websites-dialog";

export type Webtype = {
  id: string;
  package: {
    id: string;
    name: string;
  };
  name: string;
  slug?: string;
  description: string;
  image: string;
  created_at?: string;
  updated_at?: Date;
};

export const webtypeColumns = (
  onRefresh?: () => void,
): ColumnDef<Webtype>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    id: "package",
    accessorFn: (row) => row.package?.name || "",
    header: "Paket",
    cell: ({ row }) => row.original.package?.name || "-",
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="relative h-16 w-32 overflow-hidden rounded">
        <Image
          src={row.original.image}
          alt={row.original.name}
          fill
          className="object-cover"
          sizes="128px"
        />
      </div>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <EditWebtypesDialog data={row.original} onRefresh={onRefresh} />
        <DeleteWebtypesDialog data={row.original} onRefresh={onRefresh} />
      </div>
    ),
  },
];
