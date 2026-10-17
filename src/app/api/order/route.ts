import {
  retrieveData,
  addData,
  retrieveDataByFields,
} from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase/firestore";
import { handleApiError } from "@/lib/api-helper";

interface OrderRecord {
  id: string;
  client_id?: string;
  [key: string]: unknown;
}

interface ProductPackageRecord {
  id: string;
  price?: string | number;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("client_id");

    const orders = (await retrieveData("orders")) as OrderRecord[];
    const filtered = clientId
      ? orders.filter((order) => order.client_id === clientId)
      : orders;

    return NextResponse.json({ status: true, data: filtered }, { status: 200 });
  } catch (error) {
    return handleApiError("GET /api/order", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.client_id) {
      return NextResponse.json(
        { status: false, message: "client_id is required" },
        { status: 400 },
      );
    }
    if (!data.project_id) {
      return NextResponse.json(
        { status: false, message: "project_id is required" },
        { status: 400 },
      );
    }
    if (!data.package?.id) {
      return NextResponse.json(
        { status: false, message: "package.id is required" },
        { status: 400 },
      );
    }

    const packageSlug: string =
      data.package?.slug ?? data.package?.name?.toLowerCase();

    const matchingProducts = packageSlug
      ? ((await retrieveDataByFields(
          "products",
          "slug",
          packageSlug,
        )) as ProductPackageRecord[])
      : [];
    const pkg = matchingProducts[0] ?? null;

    const totalPrice = pkg ? parseInt(String(pkg.price), 10) || 0 : 0;

    if (totalPrice <= 0) {
      return NextResponse.json(
        {
          status: false,
          message:
            "Harga paket belum tersedia. Hubungi admin untuk melengkapi data paket.",
        },
        { status: 422 },
      );
    }

    const newOrder = {
      user_id: data.user_id ?? null,
      client_id: data.client_id,
      project_id: data.project_id,
      order_number: `ORD-${Date.now()}`,
      client: data.client ?? null,
      project: data.project ?? null,
      package: data.package,
      website_type: data.website_type,
      status: "WAITING_PAYMENT",
      payment: { status: "UNPAID", totalPrice },
      additionalNote: data.additionalNote ?? "",
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };

    const orderId = await addData("orders", newOrder);

    return NextResponse.json(
      { status: true, data: { id: orderId, ...newOrder } },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError("POST /api/order", error);
  }
}
