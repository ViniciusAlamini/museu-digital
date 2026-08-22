"use server";

import { cookies } from "next/headers";
import { signToken, Role } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function loginAction(username: string, passwordRaw: string) {
  const adminPassword = process.env.ADMIN_PASSWORD || "mestre123";

  // Login como Admin via .env
  if (username === "admin" && passwordRaw === adminPassword) {
    const token = await signToken("admin", "admin");
    await setCookie(token);
    return { success: true, role: "admin" as Role };
  }

  // Busca no banco de dados
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return { success: false, error: "Usuário não encontrado." };
  }

  const isValid = await bcrypt.compare(passwordRaw, user.password);
  if (!isValid) {
    return { success: false, error: "Senha incorreta." };
  }

  // Login de jogador
  const token = await signToken("player", user.username);
  await setCookie(token);
  return { success: true, role: "player" as Role };
}

export async function registerAction(username: string, passwordRaw: string, invitePassword?: string) {
  const envInvite = process.env.INVITE_PASSWORD || "convite123";
  
  if (invitePassword !== envInvite) {
    return { success: false, error: "Senha de convite inválida." };
  }

  if (username === "admin") {
    return { success: false, error: "O nome 'admin' é reservado." };
  }
  if (!username || username.length < 3) {
    return { success: false, error: "O nome de usuário deve ter pelo menos 3 caracteres." };
  }
  if (!passwordRaw || passwordRaw.length < 3) {
    return { success: false, error: "A senha deve ter pelo menos 3 caracteres." };
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { success: false, error: "Este nome de usuário já está em uso." };
  }

  const hashedPassword = await bcrypt.hash(passwordRaw, 10);
  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  // Autologin
  const token = await signToken("player", username);
  await setCookie(token);
  return { success: true };
}

async function setCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("museu_auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dias
  });
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("museu_auth");
}
