import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "./components/SessionProviderWrapper";
import HeaderWrapper from "@/components/fragments/Navbar/HeaderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Labani Order",
  description: "Aplikasi untuk membuat order website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <SessionProviderWrapper>
          <HeaderWrapper />
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
