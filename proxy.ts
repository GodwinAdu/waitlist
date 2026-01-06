import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  const { pathname } = request.nextUrl

  // Skip API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // Protected routes
  const isAdminRoute = pathname.startsWith("/admin")
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register")

  // If trying to access admin routes without token
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Verify token for admin routes
  if (isAdminRoute && token) {
    const payload = verifyToken(token)
    if (!payload) {
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("auth-token")
      return response
    }
  }

  // If authenticated user tries to access auth pages, redirect to admin
  if (isAuthRoute && token) {
    const payload = verifyToken(token)
    if (payload) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register","/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
