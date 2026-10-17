import {
  deleteData,
  retrieveDataById,
  retrieveDataByFields,
  updateData,
} from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helper";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { status: false, statusCode: 400, message: "ID is required" },
      { status: 400 },
    );
  }

  try {
    const client = await retrieveDataById("clients", id);

    if (!client) {
      return NextResponse.json(
        { status: false, statusCode: 404, message: "Client not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        data: client,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError("GET /api/client/[id]", error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { status: false, statusCode: 400, message: "ID is required" },
      { status: 400 },
    );
  }

  try {
    const existingClient = await retrieveDataById("clients", id);
    if (!existingClient) {
      return NextResponse.json(
        { status: false, statusCode: 404, message: "Client not found" },
        { status: 404 },
      );
    }

    const body = await request.json();

    const { id: _bodyId, created_at: _createdAt, ...updatePayload } = body;

    const newData = {
      ...updatePayload,
      updated_at: new Date(),
    };

    await updateData("clients", id, newData);

    const updatedClient = await retrieveDataById("clients", id);

    return NextResponse.json(
      {
        status: true,
        statusCode: 200,
        message: "success",
        data: updatedClient,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError("PUT /api/client/[id]", error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { status: false, statusCode: 400, message: "ID is required" },
      { status: 400 },
    );
  }

  try {
    const client = await retrieveDataById("clients", id);
    if (!client) {
      return NextResponse.json(
        { status: false, statusCode: 404, message: "Client not found" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    if (!force) {
      const relatedOrders = await retrieveDataByFields(
        "orders",
        "client_id",
        id,
      );

      if (relatedOrders.length > 0) {
        return NextResponse.json(
          {
            status: false,
            statusCode: 409,
            message: `Client tidak bisa dihapus karena masih memiliki ${relatedOrders.length} order terkait. Hapus atau pindahkan order tersebut terlebih dahulu, atau gunakan force=true untuk memaksa hapus.`,
            relatedOrderIds: (
              relatedOrders as { id: string }[]
            ).map((o) => o.id),
          },
          { status: 409 },
        );
      }
    }

    await deleteData("clients", id);
    return NextResponse.json(
      { status: true, statusCode: 200, message: "success" },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError("DELETE /api/client/[id]", error);
  }
}
