import AboutSection from "@/components/views/main/dashboard/homepage/about-section";
import MainPage from "@/components/views/main/dashboard/homepage/mainpage";
import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full bg-zinc-50">
      {/* Hero Section */}
      <section className="relative flex min-h-150 w-full items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-x-0 top-0 h-3/5">
          <Image
            src="/images/loginbg.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        <div className="absolute inset-0 dark:bg-black/70" />

        <div className="relative z-10 w-full">
          <MainPage />
        </div>
      </section>

      {/* About Section - benar-benar sibling dari hero, bukan child */}
      <AboutSection />
    </main>
  );
}
