import instance from "@/lib/axios/instance";

export type FirestoreTimestamp = {
  seconds: number;
  nanoseconds: number;
};

export interface Client {
  id: string;
  userId?: string | null;
  name: string;
  email: string;
  phone: string;
  city?: string | null;
  role?: string | null;
  image?: string | null;
  total_orders?: number;
  created_at: FirestoreTimestamp | null;
  updated_at: FirestoreTimestamp | null;
}

interface ClientResponse {
  status: boolean;
  data: Client;
}

export const clientServices = {
  getAllClients: async (): Promise<Client[]> => {
    const response = await instance.get<{ status: boolean; data: Client[] }>(
      "/api/client",
    );
    return response.data.data;
  },

  addClient: async (
    data: Omit<Client, "id" | "created_at" | "updated_at" | "total_orders">,
  ): Promise<Client> => {
    const response = await instance.post<ClientResponse>("/api/client", data);
    return response.data.data;
  },

  getClientById: async (id: string): Promise<Client> => {
    const response = await instance.get<ClientResponse>(`/api/client/${id}`);
    return response.data.data;
  },

  findByUserId: async (userId: string): Promise<Client | null> => {
    const response = await instance.get<{ status: boolean; data: Client[] }>(
      `/api/client?user_id=${userId}`,
    );
    return response.data.data[0] ?? null;
  },

  findByEmail: async (email: string): Promise<Client | null> => {
    const response = await instance.get<{ status: boolean; data: Client[] }>(
      `/api/client?email=${encodeURIComponent(email)}`,
    );
    return response.data.data[0] ?? null;
  },

  updateClient: async (id: string, data: Partial<Client>): Promise<Client> => {
    const response = await instance.put<ClientResponse>(
      `/api/client/${id}`,
      data,
    );
    return response.data.data;
  },

  deleteClient: async (id: string): Promise<void> => {
    await instance.delete(`/api/client/${id}`);
  },
};
