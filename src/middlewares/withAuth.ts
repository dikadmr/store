import { getToken } from "next-auth/jwt";
import {
  NextFetchEvent,
  NextRequest,
  NextResponse,
  NextProxy,
} from "next/server";

const ADMIN_ONLY_PATHS = ["admin"];
const AUTH_PAGE_PATHS = ["auth"];

function matchProtectedPath(
  pathname: string,
  protectedPaths: string[],
): string | null {
  return (
    protectedPaths.find(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    ) ?? null
  );
}

export default function withAuth(
  proxyFn: NextProxy,
  requireAuth: string[] = [],
): NextProxy {
  return async (req: NextRequest, event: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname.replace(/^\/+/, "");
    const matchedProtectedPath = matchProtectedPath(pathname, requireAuth);

    if (matchedProtectedPath) {
      const isAuthPage = Boolean(matchProtectedPath(pathname, AUTH_PAGE_PATHS));

      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token && !isAuthPage) {
        const url = new URL("/auth/login", req.url);
        url.searchParams.set("callbackUrl", encodeURIComponent(req.url));
        return NextResponse.redirect(url);
      }

      if (token) {
        if (isAuthPage) {
          return NextResponse.redirect(new URL("/", req.url));
        }

        const isAdminOnlyPath = Boolean(
          matchProtectedPath(pathname, ADMIN_ONLY_PATHS),
        );

        if (
          isAdminOnlyPath &&
          !["admin", "superadmin", "member"].includes(token.role as string)
        ) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    }

    return proxyFn(req, event);
  };
}
