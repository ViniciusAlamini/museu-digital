import { NextRequest, NextResponse } from "next/server";

const COOKIE = "museu_session";

async function validToken(token: string | undefined) {
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret || secret.length < 32) return false;
  const [payload, supplied] = token.split(".");
  if (!payload || !supplied) return false;
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const signature = new Uint8Array(
      await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)),
    );
    let binary = "";
    for (const byte of signature) binary += String.fromCharCode(byte);
    const expected = btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
    if (expected.length !== supplied.length) return false;
    let mismatch = 0;
    for (let i = 0; i < expected.length; i++) mismatch |= expected.charCodeAt(i) ^ supplied.charCodeAt(i);
    if (mismatch !== 0) return false;
    const decoded = JSON.parse(atob(payload.replaceAll("-", "+").replaceAll("_", "/"))) as {
      userId?: string;
      expiresAt?: number;
    };
    return Boolean(decoded.userId && decoded.expiresAt && decoded.expiresAt > Date.now());
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/login" || path.startsWith("/login/") || path === "/register" || path.startsWith("/register/")) {
    if (await validToken(request.cookies.get(COOKIE)?.value)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }
  if (!(await validToken(request.cookies.get(COOKIE)?.value))) {
    const login = new URL("/login", request.url);
    if (request.method === "GET") login.searchParams.set("next", path + request.nextUrl.search);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
