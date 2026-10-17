"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { webtypeServices } from "@/services/product/webtype";

export type WebsiteType = {
  id: string;
  package: {
    id: string;
    name: string;
  };
  name: string;
  slug: string;
  description: string;
  image: string;
};

export function WebsiteTypeSection({
  packageId,
  packageName,
  selectedWebsiteType,
  onSelectWebsiteType,
  onNext,
}: {
  packageId: string;
  packageName: string;
  selectedWebsiteType: WebsiteType | null;
  onSelectWebsiteType: (value: WebsiteType) => void;
  onNext: () => void;
}) {
  const [websiteTypes, setWebsiteTypes] = useState<WebsiteType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!packageId) return;

    const controller = new AbortController();

    async function fetchWebsiteTypes() {
      try {
        setIsLoading(true);

        const result = await webtypeServices.getAllWebTypes();
        const data: WebsiteType[] = result.data.data || [];

        if (!controller.signal.aborted) {
          const filteredData = data.filter((item) => {
            return item.package?.id === packageId;
          });
          setWebsiteTypes(filteredData);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to load website types:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void fetchWebsiteTypes();

    return () => {
      controller.abort();
    };
  }, [packageId]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Form Pemesanan</h1>
        <p className="mt-2 text-muted-foreground">
          Silakan pilih jenis website sesuai paket yang Anda pilih.
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <p className="text-sm text-muted-foreground">Paket Dipilih</p>
        <h2 className="text-3xl font-bold">{packageName}</h2>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Jenis Website</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pilih jenis website yang paling sesuai dengan kebutuhan Anda.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          Loading jenis website...
        </div>
      ) : websiteTypes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {websiteTypes.map((item) => {
            const isSelected = selectedWebsiteType?.id === item.id;

            return (
              <label key={item.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="website_type"
                  value={item.id}
                  checked={isSelected}
                  onChange={() => onSelectWebsiteType(item)}
                  className="sr-only"
                />

                <Card
                  className={cn(
                    "relative h-full overflow-hidden border-2 transition-all hover:border-primary hover:shadow-md",
                    isSelected
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border",
                  )}
                >
                  {isSelected && (
                    <div className="absolute right-3 top-3 z-10 rounded-full bg-primary text-primary-foreground">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  )}

                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  <CardContent className="p-4">
                    <h3 className="mb-1 text-sm font-semibold leading-tight">
                      {item.name}
                    </h3>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </label>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          Jenis website untuk paket ini belum tersedia.
        </div>
      )}

      <div className="flex justify-end">
        <Button disabled={!selectedWebsiteType} onClick={onNext}>
          Lanjut Isi Form
        </Button>
      </div>
    </div>
  );
}
