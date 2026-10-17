"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function MainPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 text-center bg-white border-zinc-50 dark:bg-black/70 dark:border-zinc-800 border rounded-lg shadow-lg p-8">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Selamat Datang
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Wujudkan Website
            <br />
            Impian Anda
          </h1>
          <p className="text-base text-muted-foreground">
            Kami membantu Anda membangun website profesional yang sesuai
            kebutuhan dari landing page sederhana hingga sistem enterprise
          </p>
        </div>

        <Button asChild size="lg" className="gap-2 px-8">
          <Link href="/order">
            Mulai Pesan Sekarang
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
