"use server";

import { prisma } from "@/lib/prisma";
import { characterSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unlink } from "fs/promises";
import path from "path";
import { requireAuth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function createCharacter(campaignId: string, formData: FormData) {
  const session = await requireAuth("player");

  const raw = {
    name: formData.get("name") as string,
    player: formData.get("player") as string,
    image: (formData.get("image") as string) || undefined,
    race: formData.get("race") as string,
    characterClass: formData.get("characterClass") as string,
    description: formData.get("description") as string,
  };

  const validated = characterSchema.parse(raw);

  const character = await prisma.character.create({
    data: {
      addedBy: session.username, ...validated, campaignId },
  });

  await logAudit(campaignId, session.username, "CRIOU", "Personagem", character.name);

  revalidatePath(`/campaigns/${campaignId}/characters`);
  redirect(`/campaigns/${campaignId}/characters/${character.id}`);
}

export async function updateCharacter(
  id: string,
  campaignId: string,
  formData: FormData
) {
  const session = await requireAuth("player");

  const raw = {
    name: formData.get("name") as string,
    player: formData.get("player") as string,
    image: (formData.get("image") as string) || undefined,
    race: formData.get("race") as string,
    characterClass: formData.get("characterClass") as string,
    description: formData.get("description") as string,
  };

  const validated = characterSchema.parse(raw);

  await prisma.character.update({
    where: { id },
    data: { ...validated, updatedBy: session.username },
  });

  await logAudit(campaignId, session.username, "EDITOU", "Personagem", validated.name);

  revalidatePath(`/campaigns/${campaignId}/characters`);
  revalidatePath(`/campaigns/${campaignId}/characters/${id}`);
  redirect(`/campaigns/${campaignId}/characters/${id}`);
}

export async function deleteCharacter(id: string, campaignId: string) {
  const session = await requireAuth("player");

  const character = await prisma.character.findUnique({ where: { id } });

  if (character?.image) {
    try {
      await unlink(path.join(process.cwd(), "public", character.image));
    } catch {
      // ignore
    }
  }

  await prisma.character.delete({ where: { id } });

  await logAudit(campaignId, session.username, "EXCLUIU", "Personagem", character?.name || "Personagem Excluído");

  revalidatePath(`/campaigns/${campaignId}/characters`);
  redirect(`/campaigns/${campaignId}/characters`);
}
