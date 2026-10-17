"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type { Client } from "@/services/client";
import { EditClientDialog } from "@/components/views/admin/clients/edit-client-dialog";
import { IconInfoCircle } from "@tabler/icons-react";

export type { Client };

export const clientColumns: ColumnDef<Client>[] = [
  {
    accessorKey: "id",
    header: "ID Client",
    cell: ({ row }) => (
      <Link
        href={`/admin/clients/${row.original.id}`}
        className="font-mono text-xs text-blue-600 hover:underline"
      >
        {row.original.id.slice(0, 8)}...
      </Link>
    ),
  },
  {
    accessorKey: "name",
    header: "Nama Client",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name || "-"}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.email || "-"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "No. WhatsApp",
    cell: ({ row }) => row.original.phone || "-",
  },
  {
    accessorKey: "city",
    header: "Kota",
    cell: ({ row }) => row.original.city || "-",
  },
  {
    accessorKey: "created_at",
    header: "Terdaftar",
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
    id: "aksi",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link href={`/admin/clients/${row.original.id}`}>
          <Button className="bg-blue-500" size="sm">
            <IconInfoCircle className="h-4 w-4" /> Detail
          </Button>
        </Link>
        <EditClientDialog data={row.original} onRefresh={() => {}} />
      </div>
    ),
  },
];
