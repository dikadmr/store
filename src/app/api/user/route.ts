import { retrieveData } from "@/lib/firebase/service";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await retrieveData("users");
  const data = (users as Record<string, unknown>[]).map((user) => {
    const { password: _, ...safeUser } = user;
    return safeUser;
  });

  return NextResponse.json(
    { status: true, statusCode: 200, message: "success", data },
    { status: 200 },
  );
}
