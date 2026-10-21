"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function changeUserRole(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!userId || !["ADMIN", "MEMBER"].includes(role)) redirect("/admin");
  if (userId === admin.id && role !== "ADMIN") redirect("/admin?error=self");
  if (role === "MEMBER") {
    const remainingAdmins = await prisma.user.count({ where: { role: "ADMIN", NOT: { id: userId } } });
    if (remainingAdmins === 0) redirect("/admin?error=last-admin");
  }
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin");
}

