"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Item, ItemContent } from "@/components/ui/item";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { getProjectProgress } from "@/app/admin/projects/columns";
import type { Project } from "@/services/project";

const ACTIVE_STATUSES = [
  "in_progress_25",
  "in_progress_50",
  "in_progress_75",
  "in_progress_100",
];

function formatDeadline(targetFinish?: string): string {
  if (!targetFinish) return "Belum ditentukan";
  return new Date(targetFinish).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatSubmittedDate(ts: Project["updated_at"]): string {
  if (!ts?.seconds) return "-";
  return new Date(ts.seconds * 1000).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function TabsProject({
  projects,
  isLoading,
}: {
  projects: Project[];
  isLoading: boolean;
}) {
  const activeProjects = projects.filter((p) =>
    ACTIVE_STATUSES.includes(p.status),
  );
  const completedProjects = projects.filter((p) => p.status === "completed");

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Memuat data project...
        </CardContent>
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Anda belum memiliki project. Order pertama Anda akan muncul di sini.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        {activeProjects.length > 0 && (
          <div>
            <CardTitle>Active Project</CardTitle>
            <div className="text-sm text-muted-foreground">
              <div className="flex max-w-full flex-col gap-6 mt-3">
                {activeProjects.map((project) => {
                  const progress = getProjectProgress(project.status);
                  return (
                    <Item key={project.id} variant="outline">
                      <ItemContent>
                        <Progress
                          value={progress}
                          className="w-full max-w-full"
                        >
                          <ProgressLabel>{project.name}</ProgressLabel>
                          <ProgressValue />
                        </Progress>
                        <div className="mt-1 text-sm text-muted-foreground flex space-x-3">
                          <p>{progress}% selesai</p>
                          <p>
                            Deadline{" "}
                            {formatDeadline(project.timeline?.targetFinish)}
                          </p>
                        </div>
                      </ItemContent>
                    </Item>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {completedProjects.length > 0 && (
          <div className="mt-6">
            <CardTitle>Project Completed</CardTitle>
            <div className="text-sm text-muted-foreground">
              <div className="flex max-w-full flex-col gap-6 mt-3">
                {completedProjects.map((project) => (
                  <Item key={project.id} variant="outline">
                    <ItemContent>
                      <Progress value={100} className="w-full max-w-full">
                        <ProgressLabel>{project.name}</ProgressLabel>
                        <ProgressValue />
                      </Progress>
                      <div className="mt-1 text-sm text-muted-foreground flex space-x-3">
                        <p>
                          Diserahkan {formatSubmittedDate(project.updated_at)}
                        </p>
                      </div>
                    </ItemContent>
                  </Item>
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Anda memiliki {activeProjects.length} project berjalan dan{" "}
          {completedProjects.length} project selesai.
        </p>
      </CardContent>
    </Card>
  );
}
