import instance from "@/lib/axios/instance";

export const paymentServices = {
  createTransaction: (orderId: string) =>
    instance.post<{
      status: boolean;
      data: { token: string; redirect_url: string };
    }>("/api/payment/create-transaction", { orderId }),
};
