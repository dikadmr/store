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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientServices, type Client } from "@/services/client";

export function EditClientDialog({
  data,
  onRefresh,
}: {
  data: Client;
  onRefresh?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
    city: data.city || "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        city: data.city || "",
      });
      setError("");
    }
  }, [open, data]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return "Nama client wajib diisi.";
    if (!form.email.trim()) return "Email wajib diisi.";
    if (!form.phone.trim()) return "Nomor WhatsApp wajib diisi.";
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await clientServices.updateClient(data.id, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: form.city,
      });

      setOpen(false);
      onRefresh?.();
    } catch (err) {
      console.error("Gagal update client:", err);
      setError("Gagal menyimpan perubahan client.");
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

      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Client</AlertDialogTitle>
        </AlertDialogHeader>

        <FieldGroup>
          <Field>
            <Label>Nama Client</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nama lengkap client"
              disabled
            />
          </Field>

          <Field>
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="client@email.com"
              disabled
            />
          </Field>

          <Field>
            <Label>Nomor WhatsApp</Label>
            <Input
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="08xxxxxxxxxx"
            />
          </Field>

          <Field>
            <Label>Kota / Domisili</Label>
            <Input
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Contoh: Medan"
            />
          </Field>
        </FieldGroup>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleSave();
            }}
            disabled={isLoading}
          >
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
