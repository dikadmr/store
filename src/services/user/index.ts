import instance from "@/lib/axios/instance";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  created_at: { seconds: number; nanoseconds: number } | null;
}

export const userServices = {
  getAllUsers: () => instance.get("/api/user"),
  getUserById: async (id: string): Promise<AppUser> => {
    const response = await instance.get<{ status: boolean; data: AppUser }>(
      `/api/user/${id}`,
    );
    return response.data.data;
  },
  updateUser: (
    id: string,
    data: Partial<AppUser> | Record<string, unknown>,
    token: string,
  ) =>
    instance.put(`/api/user/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  deleteUser: (id: string, token: string) =>
    instance.delete(`/api/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
