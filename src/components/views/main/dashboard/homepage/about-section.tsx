// components/landing/AboutSection.tsx
import { Code2 } from "lucide-react";
import { aboutPoints } from "./data";

export default function AboutSection() {
  return (
    <section className="py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#12026f] sm:text-4xl">
              PT. Labani Media Nusantara{" "}
              <span className="text-[#f9a507]">
                Software House yang Fokus pada Pertumbuhan Bisnis Anda
              </span>
            </h2>
            <p className="mt-3 text-lg text-slate-500">
              Mitra digital terpercaya untuk kebutuhan website dan sistem
              perusahaan Anda.
            </p>

            <div className="mt-6 space-y-4 text-slate-600">
              <p>
                Kami adalah software house yang berfokus pada pembuatan website,
                sistem informasi, dan aplikasi custom untuk berbagai jenis
                bisnis, mulai dari UMKM, sekolah, klinik, hingga perusahaan
                skala menengah. Setiap project kami kerjakan dengan pendekatan
                yang disesuaikan dengan kebutuhan dan tujuan bisnis klien.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {aboutPoints.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.title} className="flex gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#12026f]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {point.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {point.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-linear-to-br from-purple-100 via-purple-50 to-transparent blur-2xl" />
            <div className="bg-white border-zinc-50 dark:bg-black/70 dark:border-zinc-800 border rounded-lg shadow-lg p-8">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#12026f] text-white">
                  <Code2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Layanan Kami
                  </p>
                  <p className="text-xs text-slate-400">
                    End-to-end digital solution
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {[
                  "Jasa Pembuatan Website",
                  "Sistem Informasi Perusahaan",
                  "Website UMKM & Landing Page",
                  "Dashboard Admin",
                  "Aplikasi Custom Sesuai Kebutuhan",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#12026f]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
