import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const adminOnlyRegex = [/^\/products\/add$/, /^\/products\/edit\/[^/]+$/];
const authRequiredRegex = [
  /^\/dashboard(\/.*)?$/,
  /^\/profile(\/.*)?$/,
  ...adminOnlyRegex,
];

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  console.log(token?.role);

  // Redirect to login if not authenticated on protected pages
  if (authRequiredRegex.some((re) => re.test(pathname)) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin-only routes check
  if (adminOnlyRegex.some((re) => re.test(pathname))) {
    if (token?.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/products/add",
    "/products/edit/:path*",
  ],
};
