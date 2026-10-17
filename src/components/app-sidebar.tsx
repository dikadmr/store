"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconListDetails,
  IconUsers,
  IconWallet,
  IconShoppingCartBolt,
  IconFolder,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import Image from "next/image";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: IconDashboard,
    },
    {
      title: "Products",
      url: "#",
      isActive: true,
      icon: IconListDetails,
      items: [
        {
          title: "Package",
          url: "/admin/products/packages",
        },
        {
          title: "Web Type",
          url: "/admin/products/websitetype",
        },
      ],
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: IconShoppingCartBolt,
    },
    {
      title: "Clients",
      url: "/admin/clients",
      icon: IconUsers,
    },
    {
      title: "Projects",
      url: "/admin/projects",
      icon: IconFolder,
    },
    {
      title: "Payments",
      url: "/admin/payments",
      icon: IconWallet,
    },
    {
      title: "Profile",
      url: "/admin/profile",
      icon: IconChartBar,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: IconUsers,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const user = {
    name: session?.user?.name ?? "Guest",
    email: session?.user?.email ?? "",
    avatar: "",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/admin">
                <Image
                  src="/images/logo_labani.png"
                  alt="apple"
                  width={33}
                  height={33}
                />
                <span className="text-base font-semibold">Labani Order</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
