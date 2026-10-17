"use client";

import { useState, useRef, useEffect } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { packageServices } from "@/services/product/package";
import { useSession } from "next-auth/react";

const SCROLL_THRESHOLD = 5;

const addField = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
  setter((prev) => [...prev, ""]);
};

const removeField = (
  index: number,
  setter: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  setter((prev) => prev.filter((_, i) => i !== index));
};

const updateField = (
  index: number,
  value: string,
  setter: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  setter((prev) => prev.map((item, i) => (i === index ? value : item)));
};

const FieldList = ({
  items,
  setter,
  label,
}: {
  items: string[];
  setter: React.Dispatch<React.SetStateAction<string[]>>;
  label: string;
}) => {
  const shouldScroll = items.length >= SCROLL_THRESHOLD;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [items.length, shouldScroll]);

  const listContent = (
    <div className="flex flex-col gap-1">
      {items.map((value, index) => (
        <div key={index} className="flex items-center gap-1">
          <Input
            value={value}
            placeholder={`${label} ${index + 1}`}
            onChange={(e) => updateField(index, e.target.value, setter)}
          />
          {items.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeField(index, setter)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );

  return (
    <div className="flex flex-col gap-1">
      {shouldScroll ? (
        <ScrollArea className="h-48 rounded-md border p-2">
          {listContent}
        </ScrollArea>
      ) : (
        listContent
      )}
      <Button
        variant="link"
        size="xs"
        className="self-start"
        onClick={() => addField(setter)}
      >
        + add field
      </Button>
    </div>
  );
};

export function AddPackagesDialog({ onRefresh }: { onRefresh?: () => void }) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [targets, setTargets] = useState<string[]>([""]);
  const [features, setFeatures] = useState<string[]>([""]);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setPrice("");
    setDuration("");
    setTargets([""]);
    setFeatures([""]);
    setError("");
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError("");

    const data = {
      name,
      price,
      target: targets.filter((item) => item.trim() !== ""),
      features: features.filter((item) => item.trim() !== ""),

      duration,
    };

    try {
      const result = await packageServices.addPackage(
        data,
        session?.accessToken as string,
      );

      if (result.status === 200) {
        resetForm();
        setOpen(false);
        if (onRefresh) {
          onRefresh();
        } else {
          window.location.reload();
        }
      }
    } catch {
      setError("Gagal menambahkan package");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>Tambah Paket</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tambah Paket</AlertDialogTitle>
        </AlertDialogHeader>

        <FieldGroup>
          <Field>
            <Label htmlFor="namapaket-1">Nama Paket</Label>
            <Input
              id="namapaket-1"
              name="namapaket"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <Field>
            <Label htmlFor="harga-1">Harga</Label>
            <div className="grid max-w-full grid-cols-2 gap-1">
              <Input
                name="price"
                id="harga"
                placeholder="Harga"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </Field>

          <Field>
            <Label>Target Pengguna</Label>
            <FieldList items={targets} setter={setTargets} label="Target" />
          </Field>

          <Field>
            <Label>Fitur</Label>
            <FieldList items={features} setter={setFeatures} label="Fitur" />
          </Field>

          <Field>
            <Label htmlFor="durasi-1">Durasi</Label>
            <Input
              id="durasi-1"
              name="durasi"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
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
