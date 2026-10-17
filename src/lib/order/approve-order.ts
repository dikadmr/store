import { retrieveDataById, updateData } from "@/lib/firebase/service";
import { calculateEstimatedTimeline } from "@/lib/timeline/calculate";

interface OrderWithPackage {
  id: string;
  status: string;
  project_id?: string;
  package?: {
    duration_min_days?: number;
    duration_max_days?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export async function approveOrder(orderId: string) {
  const order = (await retrieveDataById(
    "orders",
    orderId,
  )) as OrderWithPackage | null;
  if (!order) throw new Error(`Order ${orderId} tidak ditemukan`);
  if (order.status === "APPROVED") return order;

  await updateData("orders", orderId, {
    status: "APPROVED",
    "payment.status": "PAID",
    updated_at: new Date(),
  });

  if (order.project_id) {
    const durationMin = order.package?.duration_min_days ?? 3;
    const durationMax = order.package?.duration_max_days ?? 7;
    const timeline = calculateEstimatedTimeline(
      new Date(),
      durationMin,
      durationMax,
    );

    try {
      await updateData("projects", order.project_id, {
        timeline,
        status: "in_progress_25",
        updated_at: new Date(),
      });
    } catch (err) {
      console.error("Gagal auto-update project setelah approve order:", err);
    }
  } else {
    console.warn(`Order ${orderId} di-approve tapi tidak punya project_id.`);
  }

  return order;
}
