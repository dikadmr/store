"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils/rupiah";
import Link from "next/link";
import { packageServices } from "@/services/product/package";

type Product = {
  id: string;
  name: string;
  price: string;
  target: string[];
  features: string[];
  slug: string;
  duration: string;
};

export function ProductCard() {
  const [products, setProducts] = React.useState<Product[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const result = await packageServices.getAllPackages();
        const data = result.data.data;
        if (!controller.signal.aborted && Array.isArray(data)) {
          const sortedData = [...data].sort(
            (a: Product, b: Product) => Number(a.price) - Number(b.price),
          );
          setProducts(sortedData);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Failed to fetch products:", err);
        }
      }
    }

    void loadProducts();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 mt-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
      {products.map((pkg) => {
        return (
          <div className="flex flex-col gap-2" key={pkg.id}>
            <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{pkg.name}</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="border-b pb-4">
                  <p className="text-sm text-muted-foreground">Mulai dari</p>
                  <div className="flex flex-wrap items-end gap-2 mt-1">
                    <h2 className="text-3xl font-bold sm:text-4xl">
                      {formatRupiah(pkg.price)}
                    </h2>
                    <span className="text-muted-foreground text-sm mb-1">
                      /project
                    </span>
                  </div>
                </div>
                <div className="my-4 min-h-33">
                  <h3 className="my-3 font-semibold">Target Pengguna</h3>
                  <ul className="ml-6 list-disc [&>li]:mt-2">
                    {pkg.target.map((target, index) => (
                      <li key={index}>{target}</li>
                    ))}
                  </ul>
                </div>
                <div className="my-4 min-h-48">
                  <h3 className="my-3 font-semibold">Fitur</h3>
                  <ul className="ml-6 list-disc [&>li]:mt-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-2">
                <div className="text-xs bg-muted rounded-full px-3 py-1">
                  ± {pkg.duration}
                </div>

                <Link
                  href={`/order/forms?packageId=${pkg.id}&packageName=${encodeURIComponent(pkg.name)}`}
                  className="w-full"
                >
                  <Button className="w-full hover:scale-[1.02] transition-transform">
                    Pilih Paket
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
