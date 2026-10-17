/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import type { Client } from "@/services/client";
import type { Project } from "@/services/project";
import { useEffect, useState } from "react";
import { userServices, type AppUser } from "@/services/user";

const ACTIVE_STATUSES = [
  "in_progress_25",
  "in_progress_50",
  "in_progress_75",
  "in_progress_100",
];

type FirestoreTimestamp = {
  seconds: number;
  nanoseconds: number;
};

type User = {
  name: string;
  email: string;
  avatar: string;
  created_at: FirestoreTimestamp | null;
};

export function ProfileCard({
  client,
  projects,
  isLoading,
}: {
  client: Client | null;
  projects: Project[];
  isLoading: boolean;
}) {
  const { data: session } = useSession();
  const [appUser, setAppUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = session?.user?.id;
      if (!userId) return;

      try {
        const user = await userServices.getUserById(userId);
        setAppUser(user);
      } catch (err) {
        console.error("Gagal memuat data user:", err);
      }
    };

    fetchUser();
  }, [session?.user?.id]);

  const name = session?.user?.name ?? "Guest";
  const email = session?.user?.email ?? "";

  const createdAt = appUser?.created_at
    ? new Date(appUser.created_at.seconds * 1000)
    : null;

  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed",
  ).length;
  const activeProjects = projects.filter((p) =>
    ACTIVE_STATUSES.includes(p.status),
  ).length;
  const cancelledProjects = projects.filter(
    (p) => p.status === "cancelled",
  ).length;

  return (
    <Card>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="size-16">
            <AvatarImage
              src={session?.user?.image || "https://github.com/shadcn.png"}
              alt={name}
              className="grayscale"
            />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-lg">{name}</p>
            <div className="text-sm text-muted-foreground md:flex space-x-3">
              <p>{email}</p>
              {createdAt && (
                <p>
                  Bergabung pada{" "}
                  {createdAt.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gray-50 ">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {isLoading ? "-" : totalProjects}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Project Selesai
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {isLoading ? "-" : completedProjects}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Project Berjalan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {isLoading ? "-" : activeProjects}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Project Dibatalkan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {isLoading ? "-" : cancelledProjects}
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
