import instance from "@/lib/axios/instance";
import { FirestoreTimestamp } from "@/services/project";

export interface Package {
  id: string;
  name: string;
  slug: string;
  price: string;
  features: string[];
  target: string[];
  duration_min_days: number;
  duration_max_days: number;
  created_at: FirestoreTimestamp;
  updated_at: FirestoreTimestamp;
}

export function formatDurationLabel(minDays: number, maxDays: number): string {
  if (minDays === maxDays) return `${minDays} hari`;
  return `${minDays}-${maxDays} hari`;
}

export const packageServices = {
  getAllPackages: () => instance.get("/api/product/package"),

  addPackage: (data: Partial<Package> | Record<string, unknown>, token: string) =>
    instance.post("/api/product/package", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  updatePackage: (
    id: string,
    data: Partial<Package> | Record<string, unknown>,
    token: string,
  ) =>
    instance.put(`/api/product/package/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  deletePackage: (id: string, token: string) =>
    instance.delete(`/api/product/package/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
