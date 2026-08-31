"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type CommentableEntity = "artwork" | "npc" | "message" | "diaryEntry";

export async function addComment(
  campaignId: string,
  entityType: CommentableEntity,
  entityId: string,
  content: string
) {
  if (!content || content.trim() === "") return;

  const session = await requireAuth("player");

  const data: any = {
    content: content.trim(),
    author: session.username,
  };

  if (entityType === "artwork") data.artworkId = entityId;
  else if (entityType === "npc") data.npcId = entityId;
  else if (entityType === "message") data.messageId = entityId;
  else if (entityType === "diaryEntry") data.diaryEntryId = entityId;

  await prisma.comment.create({ data });

  // Revalidar os caminhos correspondentes
  revalidatePath(`/campaigns/${campaignId}`);
  if (entityType === "artwork") revalidatePath(`/campaigns/${campaignId}/artworks/${entityId}`);
  if (entityType === "npc") revalidatePath(`/campaigns/${campaignId}/npcs/${entityId}`);
  if (entityType === "message") revalidatePath(`/campaigns/${campaignId}/messages`);
  if (entityType === "diaryEntry") revalidatePath(`/campaigns/${campaignId}/diary/${entityId}`);
}

export async function deleteComment(campaignId: string, commentId: string) {
  const session = await requireAuth("player");

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) return;

  // Somente o autor ou admin pode apagar
  if (comment.author !== session.username && session.role !== "admin") {
    throw new Error("Não autorizado");
  }

  await prisma.comment.delete({ where: { id: commentId } });

  // Revalidate everything
  revalidatePath(`/campaigns/${campaignId}`, "layout");
}
