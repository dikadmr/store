import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export interface DecodedToken {
  id?: string;
  role?: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

export function verifyAdminToken(
  request: NextRequest,
  options?: { superadminOnly?: boolean },
): { errorResponse?: NextResponse; user?: DecodedToken } {
  const authorization = request.headers.get("authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return {
      errorResponse: NextResponse.json(
        { status: false, statusCode: 401, message: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  const token = authorization.split(" ")[1] || "";

  try {
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "",
    ) as DecodedToken;

    if (options?.superadminOnly) {
      if (decoded.role !== "superadmin") {
        return {
          errorResponse: NextResponse.json(
            { status: false, statusCode: 403, message: "Forbidden" },
            { status: 403 },
          ),
        };
      }
    } else {
      if (decoded.role !== "admin" && decoded.role !== "superadmin") {
        return {
          errorResponse: NextResponse.json(
            { status: false, statusCode: 403, message: "Forbidden" },
            { status: 403 },
          ),
        };
      }
    }

    return { user: decoded };
  } catch {
    return {
      errorResponse: NextResponse.json(
        { status: false, statusCode: 401, message: "Invalid token" },
        { status: 401 },
      ),
    };
  }
}

export function handleApiError(
  routeContext: string,
  error: unknown,
): NextResponse {
  console.error(`[${routeContext}]`, error);
  return NextResponse.json(
    { status: false, message: "Internal server error" },
    { status: 500 },
  );
}

