"use server";

import { cookies } from "next/headers";
import { signToken, Role } from "@/lib/auth";

export async function loginAction(password: string) {
  const playerPassword = process.env.PLAYER_PASSWORD || "jogador123";
  const adminPassword = process.env.ADMIN_PASSWORD || "mestre123";

  let role: Role = "visitor";

  if (password === adminPassword) {
    role = "admin";
  } else if (password === playerPassword) {
    role = "player";
  }

  if (role === "visitor") {
    return { success: false, error: "Senha incorreta." };
  }

  // Gera o token JWT
  const token = await signToken(role);

  // Salva no cookie
  const cookieStore = await cookies();
  cookieStore.set("museu_auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dias
  });

  return { success: true, role };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("museu_auth");
}
