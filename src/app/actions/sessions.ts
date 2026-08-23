"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function createSession(campaignId: string, formData: FormData) {
  const sessionUser = await requireAuth("player");

  const title = formData.get("title") as string;
  const dateStr = formData.get("date") as string;
  const summary = formData.get("summary") as string;
  const participants = formData.getAll("participants") as string[];

  if (!title || !dateStr || !summary) return;

  const session = await prisma.session.create({
    data: {
      title,
      date: new Date(dateStr),
      summary,
      participants: participants.join(", "),
      campaignId,
      addedBy: sessionUser.username,
    },
  });

  await logAudit(campaignId, sessionUser.username || "Desconhecido", "CRIOU", "Sessão", title);

  revalidatePath(`/campaigns/${campaignId}/sessions`);
  redirect(`/campaigns/${campaignId}/sessions/${session.id}`);
}

export async function updateSession(
  sessionId: string,
  campaignId: string,
  formData: FormData
) {
  const sessionUser = await requireAuth("player");

  const title = formData.get("title") as string;
  const dateStr = formData.get("date") as string;
  const summary = formData.get("summary") as string;
  const participants = formData.getAll("participants") as string[];

  if (!title || !dateStr || !summary) return;

  await prisma.session.update({
    where: { id: sessionId },
    data: {
      title,
      date: new Date(dateStr),
      summary,
      participants: participants.join(", "),
      updatedBy: sessionUser.username,
    },
  });

  await logAudit(campaignId, sessionUser.username || "Desconhecido", "EDITOU", "Sessão", title);

  revalidatePath(`/campaigns/${campaignId}/sessions`);
  revalidatePath(`/campaigns/${campaignId}/sessions/${sessionId}`);
  redirect(`/campaigns/${campaignId}/sessions/${sessionId}`);
}

export async function deleteSession(sessionId: string, campaignId: string) {
  const sessionUser = await requireAuth("player");

  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) return;

  await prisma.session.delete({ where: { id: sessionId } });

  await logAudit(campaignId, sessionUser.username || "Desconhecido", "EXCLUIU", "Sessão", session.title);

  revalidatePath(`/campaigns/${campaignId}/sessions`);
  redirect(`/campaigns/${campaignId}/sessions`);
}
