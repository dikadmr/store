import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { approveOrder } from "@/lib/order/approve-order";
import { updateData } from "@/lib/firebase/service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const expectedSignature = crypto
      .createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest("hex");

    // WAJIB verifikasi signature — tanpa ini, siapa pun bisa POST palsu ke endpoint
    // ini dan menandai order manapun sebagai lunas tanpa benar-benar membayar.
    if (expectedSignature !== signature_key) {
      console.error(`Signature mismatch untuk order ${order_id}`);
      return NextResponse.json(
        { status: false, message: "Invalid signature" },
        { status: 403 },
      );
    }

    const isSuccess =
      (transaction_status === "capture" && fraud_status === "accept") ||
      transaction_status === "settlement";

    if (isSuccess) {
      await approveOrder(order_id);
    } else if (["deny", "cancel", "expire"].includes(transaction_status)) {
      try {
        await updateData("orders", order_id, {
          "payment.status": "FAILED",
          updated_at: new Date(),
        });
      } catch (err) {
        console.error("Gagal update payment status gagal:", err);
      }
    }

    return NextResponse.json({ status: true }, { status: 200 });
  } catch (error) {
    console.error("POST /api/payment/notification error:", error);
    return NextResponse.json(
      { status: false, message: "Notification handling failed" },
      { status: 500 },
    );
  }
}
