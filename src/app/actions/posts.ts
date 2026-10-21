"use server";

import { prisma } from "@/lib/prisma";
import { postSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unlink } from "fs/promises";
import path from "path";
import { recordAudit } from "@/lib/audit";

export async function createPost(campaignId: string, formData: FormData) {
  const raw = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    image: (formData.get("image") as string) || undefined,
    author: formData.get("author") as string,
    publishedAt: formData.get("publishedAt") as string,
  };

  const validated = postSchema.parse(raw);

  const post = await prisma.post.create({
    data: {
      ...validated,
      campaignId,
      publishedAt: new Date(validated.publishedAt),
    },
  });
  await recordAudit(campaignId, "criou", "Post", post.title);

  revalidatePath(`/campaigns/${campaignId}/posts`);
  redirect(`/campaigns/${campaignId}/posts/${post.id}`);
}

export async function updatePost(
  id: string,
  campaignId: string,
  formData: FormData
) {
  const raw = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    image: (formData.get("image") as string) || undefined,
    author: formData.get("author") as string,
    publishedAt: formData.get("publishedAt") as string,
  };

  const validated = postSchema.parse(raw);

  await prisma.post.update({
    where: { id },
    data: {
      ...validated,
      publishedAt: new Date(validated.publishedAt),
    },
  });
  await recordAudit(campaignId, "editou", "Post", validated.title);

  revalidatePath(`/campaigns/${campaignId}/posts`);
  revalidatePath(`/campaigns/${campaignId}/posts/${id}`);
  redirect(`/campaigns/${campaignId}/posts/${id}`);
}

export async function deletePost(id: string, campaignId: string) {
  const post = await prisma.post.findUnique({ where: { id } });
  if (post) await recordAudit(campaignId, "excluiu", "Post", post.title);

  if (post?.image) {
    try {
      await unlink(path.join(process.cwd(), "public", post.image));
    } catch {
      // ignore
    }
  }

  await prisma.post.delete({ where: { id } });

  revalidatePath(`/campaigns/${campaignId}/posts`);
  redirect(`/campaigns/${campaignId}/posts`);
}
