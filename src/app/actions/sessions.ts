"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";

export async function createSession(campaignId: string, formData: FormData) {
  const session = await requireAuth("player");

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const dateRaw = formData.get("date") as string;
  const participants = formData.getAll("participants") as string[];

  if (!title || !summary || !dateRaw) return;

  const newSession = await prisma.session.create({
    data: {
      campaignId,
      title,
      summary,
      date: new Date(dateRaw),
      participants: participants.join(", "),
      addedBy: session.username,
    },
  });

  revalidatePath(`/campaigns/${campaignId}/sessions`);
  redirect(`/campaigns/${campaignId}/sessions/${newSession.id}`);
}

export async function updateSession(
  id: string,
  campaignId: string,
  formData: FormData
) {
  const session = await requireAuth("player");

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const dateRaw = formData.get("date") as string;
  const participants = formData.getAll("participants") as string[];

  if (!title || !summary || !dateRaw) return;

  await prisma.session.update({
    where: { id },
    data: {
      title,
      summary,
      date: new Date(dateRaw),
      participants: participants.join(", "),
      updatedBy: session.username,
    },
  });

  revalidatePath(`/campaigns/${campaignId}/sessions`);
  revalidatePath(`/campaigns/${campaignId}/sessions/${id}`);
  redirect(`/campaigns/${campaignId}/sessions/${id}`);
}

export async function deleteSession(id: string, campaignId: string) {
  await requireAuth("player");

  await prisma.session.delete({ where: { id } });
  revalidatePath(`/campaigns/${campaignId}/sessions`);
  redirect(`/campaigns/${campaignId}/sessions`);
}
