import { NextResponse } from "next/server";

export function middleware(request) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/register";

  // Get the token from the cookies
  const hasAuthSession = request.cookies.has("auth-storage");

  // Redirect authenticated users away from login/register pages
  if (isPublicPath && hasAuthSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users to login page
  if (!isPublicPath && !hasAuthSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/game", "/login", "/register"]
};
