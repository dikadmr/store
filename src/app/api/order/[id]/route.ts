import {
  deleteData,
  retrieveDataById,
  updateData,
} from "@/lib/firebase/service";
import { approveOrder } from "@/lib/order/approve-order";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { ORDER_STATUSES } from "@/constant/order-status";
import { handleApiError } from "@/lib/api-helper";
import type { Order } from "@/types/order";

async function requireAdmin(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) return null;
  return token;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { status: false, message: "ID is required" },
        { status: 400 },
      );
    }

    const order = await retrieveDataById("orders", id);

    if (!order) {
      return NextResponse.json(
        { status: false, message: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ status: true, data: order }, { status: 200 });
  } catch (error) {
    return handleApiError("GET /api/order/[id]", error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authToken = await requireAdmin(request);
    if (!authToken) {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { status: false, message: "ID is required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const existingOrder = (await retrieveDataById(
      "orders",
      id,
    )) as Order | null;

    if (!existingOrder) {
      return NextResponse.json(
        { status: false, message: "Order not found" },
        { status: 404 },
      );
    }

    if (body.status && !ORDER_STATUSES.includes(body.status)) {
      return NextResponse.json(
        {
          status: false,
          message: `Status tidak valid. Gunakan salah satu: ${ORDER_STATUSES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const { id: _bodyId, created_at: _createdAt, order_number: _orderNumber, ...updatePayload } = body;

    const isNewlyApproved =
      updatePayload.status === "APPROVED" &&
      existingOrder.status !== "APPROVED";

    if (isNewlyApproved) {
      await approveOrder(id);
    } else {
      await updateData("orders", id, {
        ...updatePayload,
        updated_at: new Date(),
      });
    }

    return NextResponse.json(
      { status: true, statusCode: 200, message: "Order updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError("PUT /api/order/[id]", error);
  }
}

const PROTECTED_STATUSES = [
  "APPROVED",
  "WAITING_PAYMENT",
  "IN_PROGRESS",
  "COMPLETED",
];

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { status: false, statusCode: 400, message: "ID is required" },
        { status: 400 },
      );
    }

    const order = (await retrieveDataById("orders", id)) as Order | null;
    if (!order) {
      return NextResponse.json(
        { status: false, statusCode: 404, message: "Order not found" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    if (!force && PROTECTED_STATUSES.includes(order.status)) {
      return NextResponse.json(
        {
          status: false,
          statusCode: 409,
          message: `Order dengan status "${order.status}" sebaiknya tidak dihapus karena sudah dikonfirmasi/dikerjakan. Ubah status ke CANCELLED sebagai gantinya, atau gunakan force=true untuk memaksa hapus.`,
        },
        { status: 409 },
      );
    }

    await deleteData("orders", id);

    return NextResponse.json(
      { status: true, statusCode: 200, message: "Order deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError("DELETE /api/order/[id]", error);
  }
}
