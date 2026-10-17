import { signUp } from "@/services/auth/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("body received:", body);
    const status = await signUp(body);
    console.log("signUp status:", status);

    if (status) {
      return NextResponse.json(
        { status: true, statusCode: 200, message: "success" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { status: false, statusCode: 400, message: "failed" },
      { status: 400 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "internal server error" },
      { status: 500 },
    );
  }
}
