"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";

export async function createMessage(campaignId: string, formData: FormData) {
  const session = await requireAuth("player");

  const content = formData.get("content") as string;
  const author = formData.get("author") as string;
  const type = formData.get("type") as string;
  
  if (!content || !author || !type) return;

  const title = formData.get("title") as string | null;
  const characterId = formData.get("characterId") as string | null;
  const eventDateRaw = formData.get("eventDate") as string | null;
  const image = formData.get("image") as string | null;

  await prisma.message.create({
    data: {
      addedBy: session.username,
      campaignId,
      title: title || null,
      content,
      author,
      characterId: characterId || null,
      eventDate: eventDateRaw ? new Date(eventDateRaw) : null,
      image: image || null,
      type,
    },
  });

  revalidatePath(`/campaigns/${campaignId}/messages`);
  redirect(`/campaigns/${campaignId}/messages`);
}

export async function updateMessage(messageId: string, campaignId: string, formData: FormData) {
  const session = await requireAuth("player");

  const content = formData.get("content") as string;
  const author = formData.get("author") as string;
  const type = formData.get("type") as string;
  
  if (!content || !author || !type) return;

  const title = formData.get("title") as string | null;
  const characterId = formData.get("characterId") as string | null;
  const eventDateRaw = formData.get("eventDate") as string | null;
  const image = formData.get("image") as string | null;

  await prisma.message.update({
    where: { id: messageId },
    data: {
      updatedBy: session.username,
      title: title || null,
      content,
      author,
      characterId: characterId || null,
      eventDate: eventDateRaw ? new Date(eventDateRaw) : null,
      image: image || null,
      type,
    },
  });

  revalidatePath(`/campaigns/${campaignId}/messages`);
  redirect(`/campaigns/${campaignId}/messages`);
}

export async function deleteMessage(messageId: string, campaignId: string) {
  const session = await requireAuth("player");

  await prisma.message.delete({ where: { id: messageId } });
  revalidatePath(`/campaigns/${campaignId}/messages`);
}
