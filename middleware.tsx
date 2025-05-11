import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const loginUrl = new URL("/", request.url);
  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decoded = jwt.decode(token) as { exp?: number; role?: string } | null;

    if (!decoded || !decoded.exp || !decoded.role) {
      return NextResponse.redirect(loginUrl);
    }

    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      request.cookies.delete("accessToken");
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/service/:path*",
    "/booking/:path*",
    "/customer/:path*",
    "/reviews/:path*",
  ],
};
