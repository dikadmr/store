"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

const AUTH_ROUTES = ["auth", "admin"]; // sesuaikan dengan route kamu

export default function HeaderWrapper() {
  const pathname = usePathname();

  const disableHeader = AUTH_ROUTES.includes(pathname.split("/")[1]);

  if (disableHeader) return null;

  return <Header />;
}
