import { NextResponse } from "next/server";

const routesByRole = {
  10: ["/dashboard", "/upload", "/createUserForm"],
  20: ["/dashboard-sp", "/allFiles-sp"],
  30: ["/dashboard-oc", "/allFiles-oc"],
  40: ["/dashboard-eo", "/allFiles"],
  50: ["/dashboard-se", "/allFiles-se"],
};

export async function middleware(req) {
  try {
    const { nextUrl, cookies } = req;
    const isLoggedIn = cookies.get("__i");
    const auth_token = cookies.get("data");
    const login_role = cookies.get("type");
    console.log("Middleware executed on:", req.nextUrl.pathname);

    if (!auth_token || isLoggedIn !== 1) {
      console.log("auth_token", auth_token);
      return NextResponse.redirect(new URL("/session-expired", req.url));
    }

    const protectedRoutes = routesByRole[login_role] || [];
    if (protectedRoutes.includes(nextUrl.pathname) === false) {
      return NextResponse.redirect(new URL("/unauthorize", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.log("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/upload/:path*",
    "/createUserForm/:path*",
    "/dashboard-sp/:path*",
    "/dashboard-oc/:path*",
    "/dashboard-eo/:path*",
    "/dashboard-se/:path*",
    "/allFiles-sp/:path*",
    "/allFiles-oc/:path*",
    "/allFiles/:path*",
    "/allFiles-se/:path*",
  ],
};
