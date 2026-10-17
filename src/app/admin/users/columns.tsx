"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DeleteUserDialog } from "@/components/views/admin/users/delete-user-dialog";
import { EditUserDialog } from "@/components/views/admin/users/edit-user-dialog";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "Manager" | "Staff" | "Client";
  createdAt: Date;
};

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "no",
    header: "#",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.index + 1}</span>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nama
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const initials = row.original.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-medium shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-medium leading-tight">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.id}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div
        className="max-w-50 truncate text-muted-foreground text-sm"
        title={row.getValue("email")}
      >
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "No. HP",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.getValue("phone") || "-"}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as User["role"];
      const roleStyles: Record<string, string> = {
        superadmin: "bg-red-100 text-red-800",
        admin: "bg-purple-100 text-purple-800",
        moderator: "bg-blue-100 text-blue-800",
        member: "bg-green-100 text-green-800",
        client: "bg-yellow-100 text-yellow-800",
        suspended: "bg-gray-200 text-gray-600",
      };
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            roleStyles[row.original.role] || "bg-gray-100 text-gray-600"
          }`}
        >
          {role}
        </span>
      );
    },
  },
  {
    id: "aksi",
    header: "Aksi",
    cell: ({ row, table }) => {
      const meta = table.options.meta as { onRefresh?: () => void } | undefined;
      const onRefresh = meta?.onRefresh;
      return (
        <div className="flex gap-1.5">
          <EditUserDialog user={row.original} onRefresh={onRefresh} />
          <DeleteUserDialog user={row.original} onRefresh={onRefresh} />
        </div>
      );
    },
  },
];
