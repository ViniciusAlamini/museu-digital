"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordAudit } from "@/lib/audit";

export async function createDiaryFolder(campaignId: string, parentFolderId: string | undefined, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  
  if (!name) return;

  await prisma.diaryFolder.create({
    data: {
      campaignId,
      parentFolderId: parentFolderId || null,
      name,
      description: description || null,
    },
  });
  await recordAudit(campaignId, "criou", "Pasta do diário", name);

  revalidatePath(`/campaigns/${campaignId}/diary`);
}

export async function deleteDiaryFolder(folderId: string, campaignId: string) {
  const folder = await prisma.diaryFolder.findUnique({ where: { id: folderId } });
  if (folder) await recordAudit(campaignId, "excluiu", "Pasta do diário", folder.name);
  await prisma.diaryFolder.delete({ where: { id: folderId } });
  revalidatePath(`/campaigns/${campaignId}/diary`);
}
