// components/landing/WhyChooseUs.tsx
import { Card, CardContent } from "@/components/ui/card";
import { features } from "./data";

export default function WhyChooseUs() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header section */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            Keunggulan Kami
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Mengapa Memilih Kami
          </h2>
          <p className="mt-3 text-slate-500">
            Kami memastikan setiap website yang kami bangun tidak hanya bagus
            secara tampilan, tapi juga optimal secara performa dan mudah
            dikembangkan.
          </p>
        </div>

        {/* Grid card */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group rounded-xl border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-100"
              >
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-colors duration-300 group-hover:bg-purple-600 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
