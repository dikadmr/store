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
import { Edit, X } from "lucide-react";
import { Package } from "@/app/admin/products/packages/columns";
import {
  packageServices,
  formatDurationLabel,
} from "@/services/product/package";
import { useSession } from "next-auth/react";
import { HelperText } from "@/components/views/main/order/form/section/order-detail-form";
const SCROLL_THRESHOLD = 5;

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

  const addField = () => setter((prev) => [...prev, ""]);
  const removeField = (index: number) =>
    setter((prev) => prev.filter((_, i) => i !== index));
  const updateField = (index: number, value: string) =>
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));

  const listContent = (
    <div className="flex flex-col gap-1">
      {items.map((value, index) => (
        <div key={index} className="flex items-center gap-1">
          <Input
            value={value}
            placeholder={`${label} ${index + 1}`}
            onChange={(e) => updateField(index, e.target.value)}
          />
          {items.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeField(index)}
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
        onClick={addField}
      >
        + add field
      </Button>
    </div>
  );
};

export function EditPackagesDialog({
  data,
  onRefresh,
}: {
  data: Package;
  onRefresh?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(data.name);
  const [price, setPrice] = useState(data.price);
  const [targets, setTargets] = useState<string[]>(data.target);
  const [features, setFeatures] = useState<string[]>(data.features);
  const [durationMin, setDurationMin] = useState(data.duration_min_days);
  const [durationMax, setDurationMax] = useState(data.duration_max_days);

  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSave = async () => {
    setIsLoading(true);
    setError("");

    const newData = {
      name,
      price,
      target: targets.filter(Boolean),
      features: features.filter(Boolean),
      duration_min_days: durationMin,
      duration_max_days: durationMax,
    };

    try {
      const result = await packageServices.updatePackage(
        data.id,
        newData,
        session?.accessToken as string,
      );

      if (result.status === 200) {
        setIsLoading(false);
        setOpen(false);
        onRefresh?.();
      }
    } catch {
      setError("Gagal update package");
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
          <AlertDialogTitle>Edit Paket</AlertDialogTitle>
        </AlertDialogHeader>
        <FieldGroup>
          <Field>
            <Label htmlFor="edit-namapaket">Nama Paket</Label>
            <Input
              id="edit-namapaket"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <Field>
            <Label>Harga</Label>
            <div className="grid max-w-full grid-cols-2 gap-1">
              <Input
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
            <Label>Estimasi Pengerjaan (hari)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                value={durationMin}
                onChange={(e) => setDurationMin(Number(e.target.value))}
                placeholder="Min"
              />
              <span className="text-muted-foreground">—</span>
              <Input
                type="number"
                min={durationMin}
                value={durationMax}
                onChange={(e) => setDurationMax(Number(e.target.value))}
                placeholder="Maks"
              />
            </div>
            <HelperText>
              Preview: {formatDurationLabel(durationMin, durationMax)}
            </HelperText>
          </Field>
        </FieldGroup>

        {error && <p className="px-6 text-sm text-destructive">{error}</p>}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
