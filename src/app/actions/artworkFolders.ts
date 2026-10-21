"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordAudit } from "@/lib/audit";

export async function createArtworkFolder(campaignId: string, parentFolderId: string | undefined, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  
  if (!name) return;

  await prisma.artworkFolder.create({
    data: {
      campaignId,
      parentFolderId: parentFolderId || null,
      name,
      description: description || null,
    },
  });
  await recordAudit(campaignId, "criou", "Pasta de obras", name);

  revalidatePath(`/campaigns/${campaignId}/artworks`);
}

export async function deleteArtworkFolder(folderId: string, campaignId: string) {
  const folder = await prisma.artworkFolder.findUnique({ where: { id: folderId } });
  if (folder) await recordAudit(campaignId, "excluiu", "Pasta de obras", folder.name);
  await prisma.artworkFolder.delete({ where: { id: folderId } });
  revalidatePath(`/campaigns/${campaignId}/artworks`);
}
