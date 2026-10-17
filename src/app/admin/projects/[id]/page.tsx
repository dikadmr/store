"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectServices, type Project } from "@/services/project";
import type { StatusConfig } from "@/types/status";
import { getProjectProgress } from "@/app/admin/projects/columns";
import { Progress } from "@/components/ui/progress";

const STATUS_LABEL: { [key: string]: StatusConfig } = {
  pending: { label: "Menunggu", variant: "secondary" },
  in_progress: { label: "Dikerjakan", variant: "default" },
  completed: { label: "Selesai", variant: "secondary" },
  cancelled: { label: "Dibatalkan", variant: "destructive" },
};
const DEFAULT_STATUS = {
  label: "Tidak Diketahui",
  variant: "outline" as const,
};

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="col-span-2 font-medium">{value || "-"}</span>
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await projectServices.getProjectById(params.id);
        setProject(result.data.data);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setError("Gagal memuat data project.");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) fetchProject();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Memuat data project...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="px-5 py-10">
        <p className="text-sm text-red-500">
          {error ?? "Project tidak ditemukan."}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/admin/projects")}
        >
          Kembali ke daftar project
        </Button>
      </div>
    );
  }

  console.log("Project data:", project);
  const config = STATUS_LABEL[project.status] ?? DEFAULT_STATUS;

  const formatDate = (ts: { seconds: number } | null | undefined) =>
    ts
      ? new Date(ts.seconds * 1000).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-";

  return (
    <div className="space-y-6 px-5 py-10">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
          <p className="text-muted-foreground">
            Dibuat pada {formatDate(project.created_at)}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/projects")}
        >
          Kembali
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Umum</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow label="Paket" value={project.package?.name} />
            <InfoRow label="Tipe Website" value={project.website_type?.name} />
            <InfoRow label="Jenis Pemilik" value={project.owner_type} />
            {project.client_id && (
              <div className="pt-2">
                <Link
                  href={`/admin/clients/${project.client_id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Lihat profil client →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aset Gambar ({project.assets?.length ?? 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {!project.assets || project.assets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada aset yang diupload.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {project.assets.map((asset, index) => (
                  <a
                    key={asset.public_id || `${asset.url}-${index}`}
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-md border border-border"
                  >
                    <Image
                      src={asset.url}
                      alt={asset.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="200px"
                    />
                  </a>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deskripsi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="mb-1 text-muted-foreground">Deskripsi Project</p>
            <p className="font-medium">{project.description || "-"}</p>
          </div>
          <div>
            <p className="mb-1 text-muted-foreground">Tujuan</p>
            <p className="font-medium">{project.goal || "-"}</p>
          </div>
        </CardContent>
      </Card>

      {project.additional_note && (
        <Card>
          <CardHeader>
            <CardTitle>Catatan Tambahan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{project.additional_note}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Progress Pengerjaan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={getProjectProgress(project.status)} />
          <p className="text-sm text-muted-foreground">
            {getProjectProgress(project.status)}% selesai
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
