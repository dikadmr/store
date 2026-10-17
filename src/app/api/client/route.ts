import { addData, retrieveData } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helper";

interface ClientRecord {
  id: string;
  userId?: string;
  email?: string;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    const email = searchParams.get("email");

    const clients = (await retrieveData("clients")) as ClientRecord[];

    if (userId) {
      const found = clients.find((c) => c.userId === userId);
      return NextResponse.json({ status: true, data: found ? [found] : [] });
    }

    if (email) {
      const found = clients.find(
        (c) => c.email?.toLowerCase() === email.toLowerCase(),
      );
      return NextResponse.json({ status: true, data: found ? [found] : [] });
    }

    return NextResponse.json({ status: true, data: clients });
  } catch (error) {
    return handleApiError("GET /api/client", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newData = {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const clientId = await addData("clients", newData);
    return NextResponse.json(
      {
        status: true,
        data: {
          id: clientId,
          ...newData,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return handleApiError("POST /api/client", error);
  }
}
