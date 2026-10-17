"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type { Project } from "@/services/project";
import type { StatusConfig } from "@/types/status";
import { EditProjectDialog } from "@/components/views/admin/projects/edit-project-dialog";
import { IconInfoCircle } from "@tabler/icons-react";
export type { Project };

export const PROJECT_STATUS_OPTIONS = [
  { value: "pending", label: "Menunggu", progress: 0 },
  { value: "in_progress_25", label: "Dikerjakan (25%)", progress: 25 },
  { value: "in_progress_50", label: "Dikerjakan (50%)", progress: 50 },
  { value: "in_progress_75", label: "Dikerjakan (75%)", progress: 75 },
  { value: "in_progress_100", label: "Dikerjakan (100%)", progress: 100 },
  { value: "completed", label: "Selesai", progress: 100 },
  { value: "cancelled", label: "Dibatalkan", progress: 0 },
] as const;

export const STATUS_LABEL: { [key: string]: StatusConfig } = {
  pending: { label: "Menunggu", variant: "secondary" },
  in_progress_25: { label: "Dikerjakan (25%)", variant: "default" },
  in_progress_50: { label: "Dikerjakan (50%)", variant: "default" },
  in_progress_75: { label: "Dikerjakan (75%)", variant: "default" },
  in_progress_100: { label: "Dikerjakan (100%)", variant: "default" },
  completed: { label: "Selesai", variant: "secondary" },
  cancelled: { label: "Dibatalkan", variant: "destructive" },
};

export function getProjectProgress(status: string): number {
  return PROJECT_STATUS_OPTIONS.find((s) => s.value === status)?.progress ?? 0;
}

export const DEFAULT_STATUS: StatusConfig = {
  label: "Tidak Diketahui",
  variant: "outline",
};

export const projectColumns = (): ColumnDef<Project>[] => [
  {
    accessorKey: "name",
    header: "Nama Project",
    cell: ({ row }) => (
      <Link
        href={`/admin/projects/${row.original.id}`}
        className="font-medium text-blue-600 hover:underline"
      >
        {row.original.name || "-"}
      </Link>
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
    id: "assetsCount",
    accessorFn: (row) => row.assets?.length ?? 0,
    header: "Aset",
    cell: ({ row }) => `${row.original.assets?.length ?? 0} file`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const config = STATUS_LABEL[row.original.status] ?? DEFAULT_STATUS;
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Dibuat",
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
        <Link href={`/admin/projects/${row.original.id}`}>
          <Button className="bg-blue-500" size="sm">
            <IconInfoCircle className="h-4 w-4" /> Detail
          </Button>
        </Link>
        <EditProjectDialog data={row.original} onRefresh={() => {}} />
      </div>
    ),
  },
];
