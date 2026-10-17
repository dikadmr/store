"use client";

import { useState, useEffect } from "react";
import { Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order, OrderStatus } from "@/app/admin/orders/columns";
import { orderServices } from "@/services/order";

export function EditOrdersDialog({
  data,
  onRefresh,
}: {
  data: Order;
  onRefresh?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(
    data.status || "PENDING_CONFIRMATION",
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setStatus(data.status || "PENDING_CONFIRMATION");
      setError("");
    }
  }, [open, data.status]);

  const handleSave = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await orderServices.updateOrder(data.id, { status });

      if (result.status === 200) {
        setOpen(false);
        onRefresh?.();
      }
    } catch (err) {
      console.error("Gagal update status order:", err);
      setError("Gagal update status order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-amber-500" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Pesanan</AlertDialogTitle>
        </AlertDialogHeader>

        <FieldGroup>
          <Field>
            <Label>Nama Project</Label>
            <div className="rounded-md border bg-muted px-3 py-2 text-sm">
              {data.project?.name || "-"}
            </div>
          </Field>

          <Field>
            <Label>Client</Label>
            <div className="rounded-md border bg-muted px-3 py-2 text-sm">
              {data.client?.name || "-"}
            </div>
          </Field>

          <Field>
            <Label>Paket</Label>
            <div className="rounded-md border bg-muted px-3 py-2 text-sm">
              {data.package?.name || "-"}
            </div>
          </Field>

          <Field>
            <Label>Status Pesanan</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as OrderStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status pesanan" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="APPROVED">Pesanan Dikonfirmasi</SelectItem>
                  <SelectItem value="IN_PROGRESS">Proses</SelectItem>
                  <SelectItem value="COMPLETED">Selesai</SelectItem>
                  <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
