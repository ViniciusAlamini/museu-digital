"use server";

import { prisma } from "@/lib/prisma";
import { campaignSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unlink } from "fs/promises";
import path from "path";
import { requireAuth } from "@/lib/auth";

export async function createCampaign(formData: FormData) {
  const session = await requireAuth("admin"); // Somente mestre cria campanha
  
  const raw = {
    name: formData.get("name") as string,
    system: formData.get("system") as string,
    description: formData.get("description") as string,
    coverImage: (formData.get("coverImage") as string) || undefined,
    startDate: formData.get("startDate") as string,
  };

  const validated = campaignSchema.parse(raw);

  const campaign = await prisma.campaign.create({
    data: {
      addedBy: session.username,
      ...validated,
      startDate: new Date(validated.startDate),
    },
  });

  revalidatePath("/");
  redirect(`/campaigns/${campaign.id}`);
}

export async function updateCampaign(id: string, formData: FormData) {
  const session = await requireAuth("admin"); // Somente mestre edita campanha

  const raw = {
    name: formData.get("name") as string,
    system: formData.get("system") as string,
    description: formData.get("description") as string,
    coverImage: (formData.get("coverImage") as string) || undefined,
    startDate: formData.get("startDate") as string,
  };

  const validated = campaignSchema.parse(raw);

  await prisma.campaign.update({
    where: { id },
    data: {
      updatedBy: session.username,
      ...validated,
      startDate: new Date(validated.startDate),
    },
  });

  revalidatePath(`/campaigns/${id}`);
  revalidatePath("/");
  redirect(`/campaigns/${id}`);
}

export async function deleteCampaign(id: string) {
  const session = await requireAuth("admin"); // Exclusão de campanha restrita a Admin

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: { characters: true, artworks: true, posts: true },
  });

  if (!campaign) return;

  // Delete associated image files
  const imagesToDelete: (string | null)[] = [
    campaign.coverImage,
    ...campaign.characters.map((c) => c.image),
    ...campaign.artworks.map((a) => a.image),
    ...campaign.posts.map((p) => p.image),
  ];

  for (const imgPath of imagesToDelete) {
    if (imgPath) {
      try {
        await unlink(path.join(process.cwd(), "public", imgPath));
      } catch {
        // File might not exist, ignore
      }
    }
  }

  await prisma.campaign.delete({ where: { id } });

  revalidatePath("/");
  redirect("/");
}
