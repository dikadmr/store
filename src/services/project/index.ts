import instance from "@/lib/axios/instance";

export type FirestoreTimestamp = {
  seconds: number;
  nanoseconds: number;
};

export type ProjectAsset = {
  name: string;
  url: string;
  public_id?: string;
  type?: string;
  size?: number;
};

export interface Project {
  id: string;
  user_id: string | null;
  client_id: string | null;
  name: string;
  owner_type?: string;
  description?: string;
  target_audience?: string;
  goal?: string;
  information_contact?: string;
  service_location?: string;
  package: { id: string; name: string; slug?: string };
  website_type: { id: string; name: string; slug?: string };
  design?: { reference?: string };
  timeline?: { targetStart?: string; targetFinish?: string };
  requirements?: {
    basic?: unknown;
    professional?: unknown;
    enterprise?: unknown;
  };
  assets?: ProjectAsset[];
  additional_note?: string;
  status: string;
  created_at: FirestoreTimestamp | null;
  updated_at: FirestoreTimestamp | null;
}

export interface CreateProjectPayload {
  user_id?: string | null;
  client_id?: string | null;

  name: string;
  owner_type?: string;

  description?: string;
  target_audience?: string;
  goal?: string;
  information_contact?: string;
  service_location?: string;

  package: {
    id: string;
    name: string;
    slug: string;
  };

  websiteType: {
    id: string;
    name: string;
    slug: string;
  };

  design?: {
    reference?: string;
  };

  timeline?: {
    targetStart?: string;
    targetFinish?: string;
  };

  requirements?: {
    basic?: unknown;
    professional?: unknown;
    enterprise?: unknown;
  };

  assets?: unknown[];

  additional_note?: string;

  status?: string;
}

export const projectServices = {
  getAllProjects: () =>
    instance.get<{ status: boolean; data: Project[] }>("/api/project"),

  getProjectById: (id: string) =>
    instance.get<{ status: boolean; data: Project }>(`/api/project/${id}`),

  getProjectsByClient: (clientId: string) =>
    instance.get<{ status: boolean; data: Project[] }>(
      `/api/project?client_id=${clientId}`,
    ),

  createProject: (data: CreateProjectPayload) =>
    instance.post<{
      status: boolean;
      message: string;
      data: { id: string; [key: string]: unknown };
    }>("/api/project", data),

  updateProject: (
    id: string,
    data: Partial<CreateProjectPayload> | Record<string, unknown>,
  ) => instance.put(`/api/project/${id}`, data),

  deleteProject: (id: string) => instance.delete(`/api/project/${id}`),
};
