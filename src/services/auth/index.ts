import instance from "@/lib/axios/instance";

export const authServices = {
  registerAccount: (data: Record<string, unknown>) =>
    instance.post("/api/user/register", data),
};
