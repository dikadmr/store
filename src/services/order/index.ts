import instance from "@/lib/axios/instance";
import type { Order } from "@/app/admin/orders/columns";

export type { Order };

export interface CreateOrderPayload {
  user_id?: string | null;
  client_id: string;
  project_id: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    city?: string;
  };
  project: {
    name: string;
    ownerType: string;
    description: string;
    goal: string;
    informationContact: string;
    serviceLocation: string;
  };
  package: { id: string; name: string; slug: string };
  website_type: { id: string; name: string; slug: string };
  additionalNote?: string;
}

export const orderServices = {
  getAllOrders: () =>
    instance.get<{ status: boolean; data: Order[] }>("/api/order"),

  getOrderById: (id: string) =>
    instance.get<{ status: boolean; data: Order }>(`/api/order/${id}`),

  getOrdersByClient: (clientId: string) =>
    instance.get<{ status: boolean; data: Order[] }>(
      `/api/order?client_id=${clientId}`,
    ),

  createOrder: (data: CreateOrderPayload) =>
    instance.post<{ status: boolean; data: Order }>("/api/order", data),

  updateOrder: (id: string, data: Partial<Order>) =>
    instance.put<{ status: boolean; message: string }>(
      `/api/order/${id}`,
      data,
    ),

  deleteOrder: (id: string) =>
    instance.delete<{ status: boolean; message: string }>(`/api/order/${id}`),
};
