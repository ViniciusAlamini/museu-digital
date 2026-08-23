"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function createNpcFolder(campaignId: string, formData: FormData) {
  const session = await requireAuth("player");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const parentFolderId = formData.get("parentFolderId") as string;

  if (!name) return;

  await logAudit(campaignId, session.username || "Desconhecido", "CRIOU", "Pasta de NPCs", "Item Adicionado");

  await prisma.npcFolder.create({
    data: {
      name,
      description: description || null,
      parentFolderId: parentFolderId || null,
      campaignId,
      addedBy: session.username,
    },
  });

  revalidatePath(`/campaigns/${campaignId}/npcs`);
  redirect(`/campaigns/${campaignId}/npcs${parentFolderId ? `?folder=${parentFolderId}` : ""}`);
}

export async function updateNpcFolder(folderId: string, campaignId: string, formData: FormData) {
  const session = await requireAuth("player");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) return;

  await logAudit(campaignId, session.username || "Desconhecido", "EDITOU", "Pasta de NPCs", "Item Modificado");

  await prisma.npcFolder.update({
    where: { id: folderId },
    data: {
      name,
      description: description || null,
      updatedBy: session.username,
    },
  });

  revalidatePath(`/campaigns/${campaignId}/npcs`);
}

export async function deleteNpcFolder(folderId: string, campaignId: string) {
  const session = await requireAuth("player");

  const folder = await prisma.npcFolder.findUnique({ where: { id: folderId } });
  if (!folder) return;

  await logAudit(campaignId, (typeof session !== 'undefined' ? session.username : "Desconhecido") || "Desconhecido", "EXCLUIU", "Pasta de NPCs", "Item Deletado");

  await prisma.npcFolder.delete({ where: { id: folderId } });

  revalidatePath(`/campaigns/${campaignId}/npcs`);
  redirect(`/campaigns/${campaignId}/npcs${folder.parentFolderId ? `?folder=${folder.parentFolderId}` : ""}`);
}
