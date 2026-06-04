import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("ssb_session");
  const pathname = request.nextUrl.pathname;

  let session = null;
  if (sessionCookie) {
    try {
      session = JSON.parse(sessionCookie.value);
    } catch (e) {}
  }

  // Protect dashboard route (Admin only)
  if (pathname.startsWith("/dashboard")) {
    if (!session || session.role !== "admin") {
      const url = request.nextUrl.clone();
      if (!session) {
        url.pathname = "/login";
      } else if (session.role === "coach") {
        url.pathname = "/coach";
      } else {
        url.pathname = "/student";
      }
      return NextResponse.redirect(url);
    }
  }

  // Protect coach route (Coach & Admin)
  if (pathname === "/coach" || pathname.startsWith("/coach/")) {
    if (!session || (session.role !== "coach" && session.role !== "admin")) {
      const url = request.nextUrl.clone();
      if (!session) {
        url.pathname = "/login";
      } else if (session.role === "admin") {
        url.pathname = "/dashboard";
      } else {
        url.pathname = "/student";
      }
      return NextResponse.redirect(url);
    }
  }

  // Protect student route (Student & Admin)
  if (pathname === "/student" || pathname.startsWith("/student/")) {
    if (!session || (session.role !== "student" && session.role !== "admin")) {
      const url = request.nextUrl.clone();
      if (!session) {
        url.pathname = "/login";
      } else if (session.role === "admin") {
        url.pathname = "/dashboard";
      } else {
        url.pathname = "/coach";
      }
      return NextResponse.redirect(url);
    }
  }

  // Alihkan user yang sudah login dari halaman auth
  if (pathname === "/login" || pathname === "/register") {
    if (session) {
      const url = request.nextUrl.clone();
      if (session.role === "admin") {
        url.pathname = "/dashboard";
      } else if (session.role === "coach") {
        url.pathname = "/coach";
      } else {
        url.pathname = "/student";
      }
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
