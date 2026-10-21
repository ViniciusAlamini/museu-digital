import "server-only";

import { randomUUID } from "node:crypto";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function recordAudit(
  campaignId: string,
  action: "criou" | "editou" | "excluiu",
  entityType: string,
  entityName: string,
) {
  const user = await getCurrentUser();
  if (!user) return;
  await prisma.auditLog.create({
    data: {
      id: randomUUID(),
      campaignId,
      user: user.username,
      action,
      entityType,
      entityName,
    },
  });
}
