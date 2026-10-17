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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projectServices, type Project } from "@/services/project";
import { PROJECT_STATUS_OPTIONS } from "@/app/admin/projects/columns";

const OWNER_TYPE_OPTIONS = [
  { value: "personal", label: "Personal" },
  { value: "bisnis", label: "Bisnis" },
  { value: "organisasi", label: "Organisasi" },
  { value: "sekolah", label: "Sekolah" },
  { value: "event", label: "Event" },
  { value: "produk", label: "Produk" },
];

export function EditProjectDialog({
  data,
  onRefresh,
}: {
  data: Project;
  onRefresh?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: data.name || "",
    owner_type: data.owner_type || "",
    description: data.description || "",
    goal: data.goal || "",
    information_contact: data.information_contact || "",
    service_location: data.service_location || "",
    design_reference: data.design?.reference || "",
    status: data.status || "pending",
    additional_note: data.additional_note || "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: data.name || "",
        owner_type: data.owner_type || "",
        description: data.description || "",
        goal: data.goal || "",
        information_contact: data.information_contact || "",
        service_location: data.service_location || "",
        design_reference: data.design?.reference || "",
        status: data.status || "pending",
        additional_note: data.additional_note || "",
      });
      setError("");
    }
  }, [open, data]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Nama project wajib diisi.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await projectServices.updateProject(data.id, {
        name: form.name,
        owner_type: form.owner_type,
        description: form.description,
        goal: form.goal,
        information_contact: form.information_contact,
        service_location: form.service_location,
        design: { reference: form.design_reference },
        status: form.status,
        additional_note: form.additional_note,
      });

      setOpen(false);
      onRefresh?.();
    } catch (err) {
      console.error("Gagal update project:", err);
      setError("Gagal menyimpan perubahan project.");
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

      <AlertDialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Project</AlertDialogTitle>
        </AlertDialogHeader>

        <FieldGroup>
          <Field>
            <Label>Nama Project</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nama project"
            />
          </Field>

          <Field>
            <Label>Jenis Pemilik</Label>
            <Select
              value={form.owner_type}
              onValueChange={(value) => handleChange("owner_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis pemilik" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {OWNER_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <Label>Deskripsi Project</Label>
            <Textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </Field>

          <Field>
            <Label>Tujuan Project</Label>
            <Textarea
              value={form.goal}
              onChange={(e) => handleChange("goal", e.target.value)}
              rows={2}
            />
          </Field>

          <Field>
            <Label>Informasi Kontak</Label>
            <Input
              value={form.information_contact}
              onChange={(e) =>
                handleChange("information_contact", e.target.value)
              }
            />
          </Field>

          <Field>
            <Label>Lokasi Layanan</Label>
            <Textarea
              value={form.service_location}
              onChange={(e) => handleChange("service_location", e.target.value)}
              rows={2}
            />
          </Field>

          <Field>
            <Label>Referensi Desain</Label>
            <Textarea
              value={form.design_reference}
              onChange={(e) => handleChange("design_reference", e.target.value)}
              rows={2}
            />
          </Field>

          <Field>
            <Label>Status Project</Label>
            <Select
              value={form.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {PROJECT_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <Label>Catatan Tambahan</Label>
            <Textarea
              value={form.additional_note}
              onChange={(e) => handleChange("additional_note", e.target.value)}
              rows={2}
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
