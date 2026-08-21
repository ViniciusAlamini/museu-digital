"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDiaryFolder(campaignId: string, parentFolderId: string | undefined, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  
  if (!name) return;

  await prisma.diaryFolder.create({
    data: {
      campaignId,
      parentFolderId: parentFolderId || null,
      name,
      description: description || null,
    },
  });

  revalidatePath(`/campaigns/${campaignId}/diary`);
}

export async function deleteDiaryFolder(folderId: string, campaignId: string) {
  await prisma.diaryFolder.delete({ where: { id: folderId } });
  revalidatePath(`/campaigns/${campaignId}/diary`);
}
