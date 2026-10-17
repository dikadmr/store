import instance from "@/lib/axios/instance";

export const webtypeServices = {
  getAllWebTypes: () => instance.get("/api/product/webtype"),

  addWebtype: (data: Record<string, unknown>, token: string) =>
    instance.post("/api/product/webtype", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  updateWebtype: (
    id: string,
    data: Record<string, unknown>,
    token: string,
  ) =>
    instance.put(`/api/product/webtype/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  deleteWebtype: (id: string, token: string) =>
    instance.delete(`/api/product/webtype/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
