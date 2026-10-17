"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { clientServices, type Client } from "@/services/client";
import { projectServices } from "@/services/project";
import type { Project } from "@/services/project";
import { Order, orderServices } from "@/services/order";

interface ClientProjectsState {
  client: Client | null;
  projects: Project[];
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

export function useClientProjects(): ClientProjectsState {
  const { data: session, status: sessionStatus } = useSession();
  const [state, setState] = useState<ClientProjectsState>({
    client: null,
    projects: [],
    orders: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (sessionStatus === "loading") return;

    const fetchData = async () => {
      const userId = session?.user?.id;

      if (!userId) {
        setState({
          client: null,
          projects: [],
          orders: [],
          isLoading: false,
          error: null,
        });
        return;
      }

      try {
        const client = await clientServices.findByUserId(userId);

        if (!client) {
          // User login tapi belum pernah order — belum ada dokumen client
          setState({
            client: null,
            projects: [],
            orders: [],
            isLoading: false,
            error: null,
          });
          return;
        }

        const projectsResult = await projectServices.getProjectsByClient(
          client.id,
        );

        setState({
          client,
          projects: projectsResult.data.data || [],
          orders: [],
          isLoading: false,
          error: null,
        });

        const ordersResult = await orderServices.getOrdersByClient(client.id);

        setState({
          client,
          projects: projectsResult.data.data || [],
          orders: ordersResult.data.data || [],
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error("Gagal memuat data project client:", err);
        setState({
          client: null,
          projects: [],
          orders: [],
          isLoading: false,
          error: "Gagal memuat data project Anda.",
        });
      }
    };

    fetchData();
  }, [session?.user?.id, sessionStatus]);

  return state;
}
