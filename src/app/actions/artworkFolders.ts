"use server";

import { prisma } from "@/lib/prisma";
import { artworkFolderSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function createArtworkFolder(campaignId: string, parentId: string | undefined, formData: FormData) {
  const session = await requireAuth("player");

  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    parentFolderId: (formData.get("parentFolderId") as string) || null,
  };

  const validated = artworkFolderSchema.parse(raw);

  await logAudit(campaignId, session.username || "Desconhecido", "CRIOU", "Pasta de Artes", "Item Adicionado");

  await prisma.artworkFolder.create({
    data: {
      addedBy: session.username, ...validated, parentFolderId: parentId || validated.parentFolderId, campaignId },
  });

  revalidatePath(`/campaigns/${campaignId}/artworks`);
}

export async function deleteArtworkFolder(id: string, campaignId: string) {
  const session = await requireAuth("player");

  await prisma.artworkFolder.delete({ where: { id } });
  revalidatePath(`/campaigns/${campaignId}/artworks`);
}
