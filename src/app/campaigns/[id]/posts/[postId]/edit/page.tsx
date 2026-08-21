import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updatePost } from "@/app/actions/posts";
import { PostForm } from "@/components/post/PostForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string; postId: string }>;
}) {
  const { id, postId } = await params;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.campaignId !== id) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href={`/campaigns/${id}/posts/${postId}`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
        <h1 className="font-fantasy text-3xl font-bold text-[var(--color-text-primary)] mb-8">
          Editar Post
        </h1>
        <PostForm
          action={updatePost.bind(null, postId, id)}
          defaultValues={post}
          submitLabel="Salvar Alterações"
          cancelHref={`/campaigns/${id}/posts/${postId}`}
        />
      </div>
    </div>
  );
}
