"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LogOutIcon,
  UserIcon,
} from "lucide-react";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Software Development",
    href: "/services/software-development",
    description: "Layanan pengembangan perangkat lunak.",
  },
  {
    title: "Data Migration Service",
    href: "/services/data-migration-service",
    description: "Jasa migrasi dan integrasi data antar platfrom.",
  },
  {
    title: "Server Installation & Maintenance",
    href: "/services/server-installation-&-maintenance",
    description: "Jasa instalasi server baik hardware maupun software..",
  },
  {
    title: "Networking Infrastructure",
    href: "/services/networking-infrastructure",
    description:
      "Jasa instalasi dan pemeliharaan perangkat infrastruktur jaringan.",
  },
  {
    title: "IT Consultant",
    href: "/services/it-consultant",
    description: "Menyediakan jasa konsultasi bidang teknologi informasi.",
  },
];

type User = {
  name: string;
  email: string;
  avatar: string;
};

function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "US";
  return trimmed
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Header() {
  const isMobile = useIsMobile();
  const { data: session } = useSession();
  const user: User = {
    name: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
    avatar: session?.user?.image ?? "",
  };
  const isAuthenticated = Boolean(session);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`w-full backdrop-blur-md sticky top-0 z-50 shadow-md left-0 right-0 bg-white transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between space-x-10 items-center h-12">
          <div className="shrink-0">
            <Link
              href="/"
              className=" hover:text-gray-800 transition-colors duration-300"
            >
              <Image
                src="/images/logo_labani.png"
                alt="apple"
                width={44}
                height={44}
              />
            </Link>
          </div>

          <div className="hidden lg:block">
            <NavigationMenu viewport={isMobile}>
              <NavigationMenuList className="flex-wrap">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/">Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-2 sm:w-100 md:w-125 md:grid-cols-2 lg:w-150">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/products">Products</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className="hidden md:block">
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/about">About</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className="hidden md:block">
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/team">Team</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className="hidden md:block">
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/contact">Contact</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex">
            <div className="hidden md:flex items-center gap-3 lg:mr-4">
              {session ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-9 w-9 cursor-pointer transition-opacity hover:opacity-80">
                        <AvatarImage
                          src={user.avatar || "https://github.com/shadcn.png"}
                          alt={user.name || "User"}
                        />
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <Link
                        href="/user"
                        className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <DropdownMenuItem>
                          <UserIcon />
                          Profile
                        </DropdownMenuItem>
                      </Link>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => signOut()}
                      >
                        <LogOutIcon />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button onClick={() => signIn()}>Login</Button>
              )}
            </div>

            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger className="text-black hover:text-gray-800 transition-colors duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                </SheetTrigger>
                <SheetContent className="flex flex-col overflow-y-auto">
                  <SheetHeader className="flex flex-row items-center gap-2">
                    <Image
                      src="/images/logo_labani.png"
                      alt="apple"
                      width={33}
                      height={33}
                    />
                    <SheetTitle>Labani Order</SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col space-y-2 px-2">
                    {/* Home */}
                    <Link
                      href="/"
                      className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
                    >
                      Home
                    </Link>

                    {/* Services with Collapsible */}
                    <Collapsible
                      open={isServicesOpen}
                      onOpenChange={setIsServicesOpen}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 hover:bg-accent rounded-md transition-colors">
                        <span>Services</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isServicesOpen ? "rotate-180" : ""
                          }`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 ml-4 space-y-2">
                        {components.map((component) => (
                          <Link
                            key={component.title}
                            href={component.href}
                            className="block px-4 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                          >
                            <div className="font-medium">{component.title}</div>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Products */}
                    <Link
                      href="/products"
                      className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
                    >
                      Products
                    </Link>

                    {/* About */}
                    <Link
                      href="/about"
                      className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
                    >
                      About
                    </Link>

                    {/* Team */}
                    <Link
                      href="/team"
                      className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
                    >
                      Team
                    </Link>

                    {/* Contact */}
                    <Link
                      href="/contact"
                      className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
                    >
                      Contacts
                    </Link>
                  </div>

                  {/* Account section — gaya Converse: avatar besar + nama + tombol full-width */}
                  <div className="mt-auto flex flex-col items-center gap-3 border-t px-3 pb-3 pt-8 text-center">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={user.avatar || "https://github.com/shadcn.png"}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback className="text-lg">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>

                    {isAuthenticated ? (
                      <>
                        <div>
                          <p className="text-xl font-bold">
                            {user.name || "Pengguna"}
                          </p>
                          {user.email && (
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          )}
                        </div>

                        <Link href="/user" className="w-full ">
                          <Button className="w-full">Lihat Profil</Button>
                        </Link>

                        <button
                          onClick={() => signOut()}
                          className="text-sm text-muted-foreground underline-offset-2 hover:underline"
                        >
                          Keluar
                        </button>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-xl font-bold">Selamat Datang</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Masuk untuk memesan dan memantau project Anda.
                          </p>
                        </div>

                        <Button
                          onClick={() => signIn()}
                          className="w-full bg-black py-6 text-base hover:bg-zinc-800"
                        >
                          Masuk / Daftar
                        </Button>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
