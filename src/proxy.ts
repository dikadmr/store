import withAuth from "./middlewares/withAuth";
import { NextResponse } from "next/server";

function mainProxy() {
  return NextResponse.next();
}

export default withAuth(mainProxy, ["admin", "auth", "order/forms"]);

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*", "/order/forms/:path*"],
};
