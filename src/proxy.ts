import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_super_secret_key_museu_rpg_2026_fallback"
);

export async function proxy(request: NextRequest) {
  const isProtectedPath =
    request.nextUrl.pathname.includes("/new") ||
    request.nextUrl.pathname.includes("/edit");

  if (isProtectedPath) {
    const token = request.cookies.get("museu_auth")?.value;
    let isAuthenticated = false;

    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        isAuthenticated = true;
      } catch (e) {
        // Token inválido
      }
    }

    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
