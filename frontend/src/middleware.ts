import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/profile"];

// Routes that require specific roles
const roleRoutes: Record<string, string[]> = {
    "/dashboard/student": ["STUDENT", "FACULTY", "ADMIN"],
    "/dashboard/faculty": ["FACULTY", "ADMIN"],
    "/dashboard/admin": ["ADMIN"],
    "/dashboard/faculty/review": ["FACULTY", "ADMIN"],
    "/dashboard/admin/review": ["ADMIN"],
    "/dashboard/student/blogs/create": ["STUDENT"],
    "/dashboard/faculty/blogs/create": ["FACULTY"],
    "/dashboard/admin/blogs/create": ["ADMIN"],
};

// Routes only accessible when NOT authenticated
const authRoutes = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;

    // Check if trying to access auth routes while logged in
    if (authRoutes.some((route) => pathname.startsWith(route))) {
        if (accessToken) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.next();
    }

    // Check if trying to access protected routes without auth
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        if (!accessToken) {
            const loginUrl = new URL("/auth/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/profile/:path*",
        "/auth/:path*",
    ],
};
