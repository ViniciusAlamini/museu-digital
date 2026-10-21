"use server";

import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function safeNext(value: FormDataEntryValue | null) {
  const path = typeof value === "string" ? value : "/";
  return path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/login") && !path.startsWith("/register")
    ? path
    : "/";
}

export async function login(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const user = await prisma.user.findFirst({ where: { username: { equals: username } } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    redirect("/login?error=invalid");
  }
  await setSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function register(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const inviteCode = String(formData.get("inviteCode") ?? "").trim();
  const expectedInviteCode = process.env.INVITE_CODE;
  if (!expectedInviteCode || inviteCode !== expectedInviteCode) redirect("/register?error=invite");
  if (!/^[\p{L}\p{N}_.-]{3,24}$/u.test(username)) redirect("/register?error=username");
  if (password.length < 10 || password.length > 72) redirect("/register?error=password");
  if (password !== confirmPassword) redirect("/register?error=confirm");
  const existing = await prisma.user.findFirst({ where: { username: { equals: username } } });
  if (existing) redirect("/register?error=exists");
  const isFirstAdmin = (await prisma.user.count({ where: { role: "ADMIN" } })) === 0;
  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      username,
      passwordHash: await bcrypt.hash(password, 12),
      role: isFirstAdmin ? "ADMIN" : "MEMBER",
    },
  });
  await setSession(user.id);
  redirect("/");
}

export async function logout() {
  (await cookies()).delete("museu_session");
  redirect("/login");
}
