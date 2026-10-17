import { ProductCard } from "@/components/views/main/order/product/product-card";

export default function OrderPage() {
  return (
    <main className="min-h-screen grow px-4 py-10 sm:px-6 md:px-8 md:py-16">
      <h1 className="scroll-m-20 text-center text-2xl font-extrabold tracking-tight text-balance sm:text-3xl md:text-4xl">
        Pilih Paket
      </h1>
      <ProductCard />
    </main>
  );
}
