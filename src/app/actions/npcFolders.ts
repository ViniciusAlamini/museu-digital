"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";

export async function createNpcFolder(campaignId: string, formData: FormData) {
  const session = await requireAuth("player");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const parentFolderId = formData.get("parentFolderId") as string;

  if (!name) return;

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
  await requireAuth("player");

  const folder = await prisma.npcFolder.findUnique({ where: { id: folderId } });
  if (!folder) return;

  await prisma.npcFolder.delete({ where: { id: folderId } });

  revalidatePath(`/campaigns/${campaignId}/npcs`);
  redirect(`/campaigns/${campaignId}/npcs${folder.parentFolderId ? `?folder=${folder.parentFolderId}` : ""}`);
}
