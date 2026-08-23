"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function createDiaryFolder(campaignId: string, parentFolderId: string | undefined, formData: FormData) {
  const session = await requireAuth("player");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  
  if (!name) return;

  await logAudit(campaignId, session.username || "Desconhecido", "CRIOU", "Pasta de Diário", "Item Adicionado");

  await prisma.diaryFolder.create({
    data: {
      addedBy: session.username,
      campaignId,
      parentFolderId: parentFolderId || null,
      name,
      description: description || null,
    },
  });

  revalidatePath(`/campaigns/${campaignId}/diary`);
}

export async function deleteDiaryFolder(folderId: string, campaignId: string) {
  const session = await requireAuth("player");

  await logAudit(campaignId, (typeof session !== 'undefined' ? session.username : "Desconhecido") || "Desconhecido", "EXCLUIU", "Pasta de Diário", "Item Deletado");

  await prisma.diaryFolder.delete({ where: { id: folderId } });
  revalidatePath(`/campaigns/${campaignId}/diary`);
}
