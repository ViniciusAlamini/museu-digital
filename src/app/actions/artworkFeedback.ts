"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { ARTWORK_REACTIONS } from "@/lib/reactions";

const MAX_COMMENT = 1000;

async function findArtwork(campaignId: string, artworkId: string) {
  const artwork = await prisma.artwork.findUnique({
    where: { id: artworkId },
    select: { id: true, title: true, campaignId: true },
  });
  if (!artwork || artwork.campaignId !== campaignId) throw new Error("Desenho não encontrado.");
  return artwork;
}

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Entre na sua conta para participar.");
  return user;
}

export type CommentState = { error?: string; ok?: number };

export async function addArtworkComment(
  campaignId: string,
  artworkId: string,
  _previous: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Entre na sua conta para comentar." };
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return { error: "Escreva um comentário." };
  if (content.length > MAX_COMMENT) return { error: `Use no máximo ${MAX_COMMENT} caracteres.` };
  const artwork = await findArtwork(campaignId, artworkId);
  await prisma.comment.create({
    data: { content, author: user.username, artworkId: artwork.id },
  });
  const href = `/campaigns/${campaignId}/artworks/${artworkId}`;
  await recordAudit(campaignId, "criou", "Comentário", artwork.title, href);
  revalidatePath(href);
  return { ok: Date.now() };
}

export async function deleteArtworkComment(campaignId: string, artworkId: string, commentId: string) {
  const user = await requireUser();
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment || comment.artworkId !== artworkId) return;
  await findArtwork(campaignId, artworkId);
  if (comment.author.trim() !== user.username && user.role !== "ADMIN") {
    throw new Error("Só quem escreveu pode apagar este comentário.");
  }
  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(`/campaigns/${campaignId}/artworks/${artworkId}`);
}

export async function toggleArtworkReaction(campaignId: string, artworkId: string, emoji: string) {
  const user = await requireUser();
  if (!ARTWORK_REACTIONS.includes(emoji)) throw new Error("Reação inválida.");
  await findArtwork(campaignId, artworkId);
  const where = { artworkId, emoji, user: user.username };
  const removed = await prisma.reaction.deleteMany({ where });
  if (removed.count === 0) await prisma.reaction.create({ data: where });
  revalidatePath(`/campaigns/${campaignId}/artworks/${artworkId}`);
}
