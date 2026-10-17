"use client";

import { useState, useEffect } from "react";
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
import { Webtype } from "@/app/admin/products/websitetype/columns";
import { useSession } from "next-auth/react";
import { webtypeServices } from "@/services/product/webtype";
import { packageServices } from "@/services/product/package";
import { Edit } from "lucide-react";
import { uploadServices } from "@/services/upload";

type Package = {
  id: string;
  name: string;
};

export function EditWebtypesDialog({
  data,
  onRefresh,
}: {
  data: Webtype;
  onRefresh?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const [packages, setPackages] = useState<Package[]>([]);
  const [packageId, setPackageId] = useState(data.package?.id || "");

  const [name, setName] = useState(data.name || "");
  const [description, setDescription] = useState(data.description || "");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(data.image || "");

  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getPackages = async () => {
    const result = await packageServices.getAllPackages();
    setPackages(result.data.data || []);
  };

  useEffect(() => {
    if (open) {
      void getPackages();

      setPackageId(data.package?.id || "");
      setName(data.name || "");
      setDescription(data.description || "");
      setPreviewImage(data.image || "");
      setImageFile(null);
      setError("");
    }
  }, [open, data]);

  const handleSave = async () => {
    setIsLoading(true);
    setError("");

    try {
      let imageUrl = previewImage;

      if (imageFile) {
        const uploadResult = await uploadServices.uploadFile(imageFile);
        imageUrl = uploadResult.data.url;
      }

      const selectedPackage = packages.find((item) => item.id === packageId);

      const newData = {
        package: {
          id: selectedPackage?.id || packageId,
          name: selectedPackage?.name || data.package?.name || "",
        },
        name,
        description,
        image: imageUrl,
      };

      const result = await webtypeServices.updateWebtype(
        data.id,
        newData,
        session?.accessToken as string,
      );

      if (result.status === 200) {
        setOpen(false);
        onRefresh?.();
      }
    } catch {
      setError("Gagal update website type");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Edit />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Website Type</AlertDialogTitle>
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
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>

          <Field>
            <Label>Deskripsi</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>

          <Field>
            <Label>Image</Label>

            {previewImage && (
              <div className="mb-3 overflow-hidden rounded-md border">
                {/* eslint-disable-next-line @next/next/no-img-element -- Local blob preview / dynamic URL */}
                <img
                  src={previewImage}
                  alt={name}
                  className="h-40 w-full object-cover"
                />
              </div>
            )}

            <Input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);

                if (file) {
                  setPreviewImage(URL.createObjectURL(file));
                }
              }}
            />
          </Field>
        </FieldGroup>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

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
