import { redirect } from "next/navigation";

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/order/${id}/payment`);
}

