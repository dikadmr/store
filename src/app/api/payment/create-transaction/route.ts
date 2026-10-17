import { NextRequest, NextResponse } from "next/server";
import { retrieveDataById } from "@/lib/firebase/service";
import { snap } from "@/lib/midtrans";
import { handleApiError } from "@/lib/api-helper";

interface OrderTransaction {
  id: string;
  status: string;
  client?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  package?: {
    id?: string;
    name?: string;
  };
  website_type?: {
    name?: string;
  };
  payment?: {
    totalPrice?: number;
  };
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { status: false, message: "orderId is required" },
        { status: 400 },
      );
    }

    const order = (await retrieveDataById(
      "orders",
      orderId,
    )) as OrderTransaction | null;
    if (!order) {
      return NextResponse.json(
        { status: false, message: "Order not found" },
        { status: 404 },
      );
    }

    if (order.status !== "WAITING_PAYMENT") {
      return NextResponse.json(
        {
          status: false,
          message: "Order ini tidak dalam status menunggu pembayaran.",
        },
        { status: 400 },
      );
    }

    const totalPrice = order.payment?.totalPrice;
    if (!totalPrice || totalPrice <= 0) {
      return NextResponse.json(
        { status: false, message: "Harga paket tidak valid. Hubungi admin." },
        { status: 400 },
      );
    }

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: totalPrice,
      },
      customer_details: {
        first_name: order.client?.name || "Customer",
        email: order.client?.email || undefined,
        phone: order.client?.phone || undefined,
      },
      item_details: [
        {
          id: order.package?.id || "package",
          price: totalPrice,
          quantity: 1,
          name: `Paket ${order.package?.name || "-"} - ${order.website_type?.name || "-"}`,
        },
      ],
    });

    return NextResponse.json(
      {
        status: true,
        data: {
          token: transaction.token,
          redirect_url: transaction.redirect_url,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError("POST /api/payment/create-transaction", error);
  }
}
