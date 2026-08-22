"use server";

import { prisma } from "@/lib/prisma";
import { artworkSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unlink } from "fs/promises";
import path from "path";
import { requireAuth } from "@/lib/auth";

export async function createArtwork(campaignId: string, formData: FormData) {
  await requireAuth("player");

  const raw = {
    title: formData.get("title") as string,
    image: formData.get("image") as string,
    artist: formData.get("artist") as string,
    description: formData.get("description") as string,
    date: formData.get("date") as string,
    folderId: formData.get("folderId") as string | null,
  };

  const validated = artworkSchema.parse(raw);

  const artwork = await prisma.artwork.create({
    data: { ...validated, folderId: validated.folderId || null, campaignId, date: new Date(validated.date) },
  });

  revalidatePath(`/campaigns/${campaignId}/artworks`);
  // Redireciona de volta para a lista daquela pasta ou da raiz
  redirect(`/campaigns/${campaignId}/artworks${validated.folderId ? `?folder=${validated.folderId}` : ""}`);
}

export async function updateArtwork(
  id: string,
  campaignId: string,
  formData: FormData
) {
  await requireAuth("player");

  const raw = {
    title: formData.get("title") as string,
    image: formData.get("image") as string,
    artist: formData.get("artist") as string,
    description: formData.get("description") as string,
    date: formData.get("date") as string,
    folderId: formData.get("folderId") as string | null,
  };

  const validated = artworkSchema.parse(raw);

  await prisma.artwork.update({
    where: { id },
    data: { ...validated, date: new Date(validated.date) },
  });

  revalidatePath(`/campaigns/${campaignId}/artworks`);
  revalidatePath(`/campaigns/${campaignId}/artworks/${id}`);
  redirect(`/campaigns/${campaignId}/artworks/${id}`);
}

export async function deleteArtwork(id: string, campaignId: string) {
  await requireAuth("player");

  const artwork = await prisma.artwork.findUnique({ where: { id } });

  if (artwork?.image) {
    try {
      await unlink(path.join(process.cwd(), "public", artwork.image));
    } catch {
      // ignore
    }
  }

  await prisma.artwork.delete({ where: { id } });

  revalidatePath(`/campaigns/${campaignId}/artworks`);
  redirect(`/campaigns/${campaignId}/artworks`);
}
