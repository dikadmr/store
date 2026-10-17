// src/app/profile/page.tsx (sesuaikan path kalau berbeda)
"use client";

import { ProfileCard } from "@/components/views/main/user/profile/profile-card";
import { ProfileTabs } from "@/components/views/main/user/tabs/profile-tabs";
import { useClientProjects } from "@/hooks/use-client-projects";

export default function ProfilePage() {
  const { client, projects, orders, isLoading, error } = useClientProjects();

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-5 py-10">
      <ProfileCard client={client} projects={projects} isLoading={isLoading} />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <ProfileTabs projects={projects} orders={orders} isLoading={isLoading} />
    </div>
  );
}
