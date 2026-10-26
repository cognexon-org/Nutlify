import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Keeps everything under /admin behind the admin login (pages also check on the server).
export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  const token = req.cookies.get("nutlify_admin")?.value;
  try {
    if (!token || !process.env.AUTH_SECRET) throw new Error("no session");
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
    if (payload.role !== "admin") throw new Error("not admin");
    return NextResponse.next();
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
}

export const config = { matcher: ["/admin/:path*"] };
