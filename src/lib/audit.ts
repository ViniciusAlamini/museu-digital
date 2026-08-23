import { prisma } from "@/lib/prisma";

export async function logAudit(
  campaignId: string,
  user: string,
  action: "CRIOU" | "EDITOU" | "EXCLUIU",
  entityType: string,
  entityName: string,
  details?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        campaignId,
        user,
        action,
        entityType,
        entityName,
        details,
      },
    });
  } catch (error) {
    console.error("Erro ao registrar log de auditoria:", error);
  }
}
