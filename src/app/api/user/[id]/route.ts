import {
  deleteData,
  updateData,
  retrieveDataById,
} from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, handleApiError } from "@/lib/api-helper";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { status: false, message: "ID is required" },
      { status: 400 },
    );
  }

  try {
    const user = await retrieveDataById("users", id);

    if (!user) {
      return NextResponse.json(
        { status: false, message: "User not found" },
        { status: 404 },
      );
    }

    const { password: _, ...safeUser } = user as Record<string, unknown>;

    return NextResponse.json({ status: true, data: safeUser }, { status: 200 });
  } catch (error) {
    return handleApiError("GET /api/user/[id]", error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = verifyAdminToken(request);
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { status: false, statusCode: 400, message: "ID is required" },
      { status: 400 },
    );
  }

  try {
    const data = await request.json();

    await updateData("users", id, data);

    return NextResponse.json(
      { status: true, statusCode: 200, message: "success" },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError("PUT /api/user/[id]", error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = verifyAdminToken(request, { superadminOnly: true });
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { status: false, statusCode: 400, message: "ID is required" },
      { status: 400 },
    );
  }

  try {
    await deleteData("users", id);

    return NextResponse.json(
      { status: true, statusCode: 200, message: "success" },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError("DELETE /api/user/[id]", error);
  }
}
