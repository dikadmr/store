"use client";

import { useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";
import { uploadServices } from "@/services/upload";
import { webtypeServices } from "@/services/product/webtype";
import { packageServices } from "@/services/product/package";

type Package = {
  id: string;
  name: string;
};

export function AddWebsitesDialog({ onRefresh }: { onRefresh?: () => void }) {
  const [open, setOpen] = useState(false);

  const [packages, setPackages] = useState<Package[]>([]);
  const [packageId, setPackageId] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getPackages = async () => {
    const result = await packageServices.getAllPackages();
    setPackages(result.data.data || []);
  };

  useEffect(() => {
    void getPackages();
  }, []);

  const resetForm = () => {
    setPackageId("");
    setName("");
    setDescription("");
    setImage(null);
    setError("");
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError("");

    try {
      let imageUrl = "";

      if (image) {
        const uploadResult = await uploadServices.uploadFile(image, "webtypes");
        imageUrl = uploadResult.data.url;
      }

      const selectedPackage = packages.find((item) => item.id === packageId);

      const data = {
        package: {
          id: selectedPackage?.id || "",
          name: selectedPackage?.name || "",
        },
        name,
        description,
        image: imageUrl,
      };

      const result = await webtypeServices.addWebtype(
        data,
        session?.accessToken as string,
      );

      if (result.status === 200) {
        resetForm();
        setOpen(false);
        onRefresh?.();
      }
    } catch {
      setError("Gagal menambahkan website type");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>Tambah Website Type</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tambah Website Type</AlertDialogTitle>
        </AlertDialogHeader>

        <FieldGroup>
          <Field>
            <Label>Paket</Label>
            <Select value={packageId} onValueChange={setPackageId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih paket" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {packages.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <Label>Nama Website Type</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Company Profile"
            />
          </Field>

          <Field>
            <Label>Deskripsi</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat website type"
            />
          </Field>

          <Field>
            <Label>Image</Label>
            <Input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </Field>
        </FieldGroup>

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

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
