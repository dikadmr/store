// components/landing/data.ts
// Kumpulan data dummy untuk seluruh section landing page.
// Silakan ganti isinya dengan data asli perusahaan Anda nantinya.

import {
  Rocket,
  ShieldCheck,
  Headphones,
  Smartphone,
  Search,
  Palette,
  Users,
  Briefcase,
  Clock,
  ThumbsUp,
  LucideIcon,
} from "lucide-react";

// ==========================================
// 1. ABOUT SECTION
// ==========================================
export interface AboutPoint {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const aboutPoints: AboutPoint[] = [
  {
    icon: Rocket,
    title: "Pengerjaan Cepat",
    description:
      "Rata-rata website selesai dalam 7-14 hari kerja tanpa mengorbankan kualitas.",
  },
  {
    icon: ShieldCheck,
    title: "Bergaransi",
    description:
      "Setiap project dilengkapi garansi bug dan revisi minor selama 30 hari.",
  },
  {
    icon: Users,
    title: "Tim Berpengalaman",
    description:
      "Ditangani oleh developer dan designer dengan pengalaman di berbagai industri.",
  },
  {
    icon: Headphones,
    title: "Support Responsif",
    description:
      "Tim support siap membantu kendala teknis Anda melalui chat maupun email.",
  },
];

// ==========================================
// 2. WHY CHOOSE US
// ==========================================
export interface FeatureCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const features: FeatureCard[] = [
  {
    icon: Rocket,
    title: "Website Cepat",
    description:
      "Dioptimasi untuk loading time di bawah 2 detik agar pengunjung betah.",
  },
  {
    icon: Smartphone,
    title: "Fully Responsive",
    description:
      "Tampilan tetap rapi di HP, tablet, maupun desktop tanpa geser layout.",
  },
  {
    icon: Search,
    title: "SEO Friendly",
    description:
      "Struktur kode bersih dan sesuai kaidah SEO agar mudah ditemukan di Google.",
  },
  {
    icon: Palette,
    title: "UI Modern",
    description:
      "Desain mengikuti tren terkini, clean, dan disesuaikan dengan identitas brand.",
  },
  {
    icon: ShieldCheck,
    title: "Bergaransi",
    description:
      "Garansi perbaikan bug dan penyesuaian minor setelah website live.",
  },
  {
    icon: Headphones,
    title: "Support Setelah Jadi",
    description:
      "Pendampingan pasca-launching, mulai dari maintenance hingga penambahan fitur.",
  },
];

// ==========================================
// 3. COMPANY STATS
// ==========================================
export interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
}

export const stats: StatItem[] = [
  { icon: Briefcase, value: "250+", label: "Project Selesai" },
  { icon: Users, value: "120+", label: "Client" },
  { icon: Clock, value: "5 Tahun", label: "Pengalaman" },
  { icon: ThumbsUp, value: "98%", label: "Client Puas" },
];

// ==========================================
// 4. TESTIMONIALS
// ==========================================
export interface Testimonial {
  name: string;
  company: string;
  avatar: string;
  rating: number;
  review: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Budi Santoso",
    company: "Owner, Klinik Sehat Bersama",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
    rating: 5,
    review:
      "Website klinik kami jadi terlihat jauh lebih profesional. Proses booking online juga sangat membantu mengurangi antrian di lokasi. Tim sangat komunikatif selama pengerjaan.",
  },
  {
    name: "Siti Nurhaliza",
    company: "Marketing, Toko Berkah Jaya",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
    rating: 5,
    review:
      "Awalnya ragu karena budget terbatas, tapi hasilnya di luar ekspektasi. Website toko online kami sekarang jauh lebih cepat dan enak dilihat pelanggan.",
  },
  {
    name: "Ahmad Fauzi",
    company: "Direktur, PT Maju Bersama",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
    rating: 5,
    review:
      "Sistem informasi yang dibuat sangat membantu operasional perusahaan kami sehari-hari. Prosesnya rapi, ada timeline jelas, dan revisinya cepat direspon.",
  },
  {
    name: "Dewi Lestari",
    company: "Kepala Sekolah, SMK Nusantara",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi",
    rating: 4,
    review:
      "Website sekolah kami sekarang lebih informatif dan mudah diakses orang tua siswa. Ada beberapa revisi kecil di awal, tapi semua ditangani dengan baik.",
  },
  {
    name: "Rizky Pratama",
    company: "Founder, Kopi Senja",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rizky",
    rating: 5,
    review:
      "Landing page untuk campaign promo kami selesai lebih cepat dari perkiraan. Konversi penjualan online naik cukup signifikan setelah website baru rilis.",
  },
  {
    name: "Putri Ayu",
    company: "Owner, Ayu Travel & Tour",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Putri",
    rating: 5,
    review:
      "Fitur pemesanan paket wisata di website kami jadi lebih mudah dipakai calon pelanggan. Desainnya juga cocok banget dengan branding travel kami.",
  },
];

// ==========================================
// 5. PORTFOLIO / PROJECT TERBARU
// ==========================================
export interface Project {
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  techStack: string[];
}

export const projects: Project[] = [
  {
    title: "Klinik Sehat Bersama",
    category: "Company Profile",
    description:
      "Website profil klinik lengkap dengan fitur booking jadwal dokter online.",
    thumbnail: "https://placehold.co/600x400/7c3aed/ffffff?text=Klinik+Sehat",
    techStack: ["Next.js", "Tailwind CSS"],
  },
  {
    title: "SMK Nusantara",
    category: "Website Sekolah",
    description:
      "Website sekolah dengan informasi akademik, PPDB online, dan galeri kegiatan.",
    thumbnail: "https://placehold.co/600x400/6d28d9/ffffff?text=SMK+Nusantara",
    techStack: ["Laravel", "Bootstrap"],
  },
  {
    title: "Gudang Makmur",
    category: "Dashboard Inventory",
    description:
      "Sistem manajemen stok barang gudang dengan laporan otomatis dan notifikasi.",
    thumbnail:
      "https://placehold.co/600x400/5b21b6/ffffff?text=Inventory+System",
    techStack: ["React", "Firebase"],
  },
  {
    title: "PT Maju Bersama",
    category: "Company Profile",
    description:
      "Website perusahaan dengan halaman produk, karir, dan berita perusahaan.",
    thumbnail:
      "https://placehold.co/600x400/7c3aed/ffffff?text=PT+Maju+Bersama",
    techStack: ["Next.js", "Sanity CMS"],
  },
  {
    title: "Kopi Senja Kasir",
    category: "Sistem Kasir",
    description:
      "Aplikasi kasir untuk kedai kopi dengan laporan penjualan harian dan stok bahan.",
    thumbnail: "https://placehold.co/600x400/6d28d9/ffffff?text=Sistem+Kasir",
    techStack: ["React", "Node.js"],
  },
  {
    title: "Ayu Travel & Tour",
    category: "Website Travel",
    description:
      "Website travel dengan katalog paket wisata dan sistem pemesanan online.",
    thumbnail: "https://placehold.co/600x400/5b21b6/ffffff?text=Ayu+Travel",
    techStack: ["Next.js", "Tailwind CSS"],
  },
];

// ==========================================
// 7. FAQ
// ==========================================
export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "Bagaimana proses pemesanan jasa pembuatan website?",
    answer:
      "Anda cukup menghubungi kami melalui form konsultasi atau WhatsApp, lalu kami akan diskusi kebutuhan, memberikan penawaran, dan mulai pengerjaan setelah ada kesepakatan.",
  },
  {
    question: "Berapa kali revisi yang saya dapatkan?",
    answer:
      "Setiap paket mendapatkan minimal 3 kali revisi selama proses desain dan pengembangan, sebelum website dinyatakan final.",
  },
  {
    question: "Apakah ada garansi setelah website selesai?",
    answer:
      "Ya, kami memberikan garansi perbaikan bug selama 30 hari setelah website live tanpa biaya tambahan.",
  },
  {
    question: "Apakah tersedia layanan maintenance setelah website jadi?",
    answer:
      "Tersedia. Kami menyediakan paket maintenance bulanan maupun tahunan untuk update konten, keamanan, dan backup berkala.",
  },
  {
    question: "Berapa lama waktu pengerjaan website?",
    answer:
      "Rata-rata pengerjaan memakan waktu 7-14 hari kerja tergantung kompleksitas fitur dan kecepatan feedback dari klien.",
  },
  {
    question: "Bagaimana sistem pembayarannya?",
    answer:
      "Pembayaran dilakukan dengan sistem DP 50% di awal dan pelunasan setelah website selesai dan disetujui oleh klien.",
  },
];
