import OrderForm from "@/components/views/main/order/form/order-form";
import { Suspense } from "react";

export default function CombinedOrderForm() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 font-sans dark:bg-black sm:px-6 md:px-8">
      <div className="text-zinc-900 dark:text-zinc-50">
        <Suspense fallback={<div>Loading...</div>}>
          <OrderForm />
        </Suspense>
      </div>
    </main>
  );
}
