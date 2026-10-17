import { addData, retrieveData } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";
import { generateSlug } from "@/lib/utils/slug";
import { verifyAdminToken, handleApiError } from "@/lib/api-helper";

export async function GET() {
  const webtypes = await retrieveData("webtypes");

  return NextResponse.json(
    {
      status: true,
      statusCode: 200,
      data: webtypes,
    },
    { status: 200 },
  );
}

export async function POST(request: NextRequest) {
  const auth = verifyAdminToken(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const data = await request.json();

    const newData = {
      ...data,
      slug: generateSlug(data.name || ""),
      created_at: new Date(),
      updated_at: new Date(),
    };

    await addData("webtypes", newData);

    return NextResponse.json(
      { status: true, statusCode: 200, message: "success" },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError("POST /api/product/webtype", error);
  }
}
