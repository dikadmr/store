import { deleteData, updateData } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";
import { generateSlug } from "@/lib/utils/slug";
import { verifyAdminToken, handleApiError } from "@/lib/api-helper";

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

    const newData = {
      ...data,
      slug: generateSlug(data.name || ""),
      updated_at: new Date(),
    };

    await updateData("webtypes", id, newData);

    return NextResponse.json(
      { status: true, statusCode: 200, message: "success" },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError("PUT /api/product/webtype/[id]", error);
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
    await deleteData("webtypes", id);

    return NextResponse.json(
      { status: true, statusCode: 200, message: "success" },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError("DELETE /api/product/webtype/[id]", error);
  }
}
