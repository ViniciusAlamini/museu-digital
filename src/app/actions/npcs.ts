"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function createNpc(campaignId: string, formData: FormData) {
  const session = await requireAuth("player");

  const name = formData.get("name") as string;
  const race = formData.get("race") as string;
  const occupation = formData.get("occupation") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const folderId = formData.get("folderId") as string;

  if (!name || !description) return;

  const npc = await prisma.npc.create({
    data: {
      name,
      race: race || null,
      occupation: occupation || null,
      description,
      image: image || null,
      folderId: folderId || null,
      campaignId,
      addedBy: session.username,
    },
  });

  await logAudit(campaignId, session.username || "Desconhecido", "CRIOU", "NPC", name, `/campaigns/${campaignId}/npcs/${npc.id}`);

  revalidatePath(`/campaigns/${campaignId}/npcs`);
  redirect(`/campaigns/${campaignId}/npcs/${npc.id}`);
}

export async function updateNpc(
  npcId: string,
  campaignId: string,
  formData: FormData
) {
  const session = await requireAuth("player");

  const name = formData.get("name") as string;
  const race = formData.get("race") as string;
  const occupation = formData.get("occupation") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const folderId = formData.get("folderId") as string;

  if (!name || !description) return;

  await prisma.npc.update({
    where: { id: npcId },
    data: {
      name,
      race: race || null,
      occupation: occupation || null,
      description,
      image: image || null,
      folderId: folderId || null,
      updatedBy: session.username,
    },
  });

  await logAudit(campaignId, session.username || "Desconhecido", "EDITOU", "NPC", name, `/campaigns/${campaignId}/npcs/${npcId}`);

  revalidatePath(`/campaigns/${campaignId}/npcs`);
  revalidatePath(`/campaigns/${campaignId}/npcs/${npcId}`);
  redirect(`/campaigns/${campaignId}/npcs/${npcId}`);
}

export async function deleteNpc(npcId: string, campaignId: string) {
  const session = await requireAuth("player");

  const npc = await prisma.npc.findUnique({ where: { id: npcId } });
  if (!npc) return;

  await prisma.npc.delete({ where: { id: npcId } });

  await logAudit(campaignId, session.username || "Desconhecido", "EXCLUIU", "NPC", npc.name);

  revalidatePath(`/campaigns/${campaignId}/npcs`);
  redirect(`/campaigns/${campaignId}/npcs${npc.folderId ? `?folder=${npc.folderId}` : ""}`);
}
