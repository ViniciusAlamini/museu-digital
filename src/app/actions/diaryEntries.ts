"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDiaryEntry(campaignId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;
  const dateRaw = formData.get("date") as string;
  
  if (!title || !content || !author || !dateRaw) return;

  const folderId = formData.get("folderId") as string | null;
  const relatedCharacterId = formData.get("relatedCharacterId") as string | null;

  await prisma.diaryEntry.create({
    data: {
      campaignId,
      title,
      content,
      author,
      date: new Date(dateRaw),
      folderId: folderId || null,
      relatedCharacterId: relatedCharacterId || null,
    },
  });

  const query = folderId ? `?folderId=${folderId}` : "";
  revalidatePath(`/campaigns/${campaignId}/diary`);
  redirect(`/campaigns/${campaignId}/diary${query}`);
}

export async function updateDiaryEntry(entryId: string, campaignId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;
  const dateRaw = formData.get("date") as string;
  
  if (!title || !content || !author || !dateRaw) return;

  const folderId = formData.get("folderId") as string | null;
  const relatedCharacterId = formData.get("relatedCharacterId") as string | null;

  await prisma.diaryEntry.update({
    where: { id: entryId },
    data: {
      title,
      content,
      author,
      date: new Date(dateRaw),
      folderId: folderId || null,
      relatedCharacterId: relatedCharacterId || null,
    },
  });

  const query = folderId ? `?folderId=${folderId}` : "";
  revalidatePath(`/campaigns/${campaignId}/diary`);
  redirect(`/campaigns/${campaignId}/diary${query}`);
}

export async function moveDiaryEntry(entryId: string, campaignId: string, newFolderId: string | null) {
  await prisma.diaryEntry.update({
    where: { id: entryId },
    data: { folderId: newFolderId },
  });
  revalidatePath(`/campaigns/${campaignId}/diary`);
}

export async function deleteDiaryEntry(entryId: string, campaignId: string, currentFolderId: string | null) {
  await prisma.diaryEntry.delete({ where: { id: entryId } });
  revalidatePath(`/campaigns/${campaignId}/diary`);
}
