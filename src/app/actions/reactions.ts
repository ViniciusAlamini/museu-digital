"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type ReactionableEntity = "artwork" | "npc" | "message" | "diaryEntry";

export async function toggleReaction(
  campaignId: string,
  entityType: ReactionableEntity,
  entityId: string,
  emoji: string
) {
  const session = await requireAuth("player");
  const username = session.username;

  const whereClause: any = { emoji, user: username };
  if (entityType === "artwork") whereClause.artworkId = entityId;
  else if (entityType === "npc") whereClause.npcId = entityId;
  else if (entityType === "message") whereClause.messageId = entityId;
  else if (entityType === "diaryEntry") whereClause.diaryEntryId = entityId;

  // Em SQLite sem unique múltiplo, nós procuramos manualmente
  const existingReaction = await prisma.reaction.findFirst({
    where: whereClause,
  });

  if (existingReaction) {
    await prisma.reaction.delete({ where: { id: existingReaction.id } });
  } else {
    await prisma.reaction.create({ data: whereClause });
  }

  // Revalidar caminhos
  revalidatePath(`/campaigns/${campaignId}`);
  if (entityType === "artwork") revalidatePath(`/campaigns/${campaignId}/artworks/${entityId}`);
  if (entityType === "npc") revalidatePath(`/campaigns/${campaignId}/npcs/${entityId}`);
  if (entityType === "message") revalidatePath(`/campaigns/${campaignId}/messages`);
  if (entityType === "diaryEntry") revalidatePath(`/campaigns/${campaignId}/diary/${entityId}`);
}
