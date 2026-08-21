import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { deletePost } from "@/app/actions/posts";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Edit, Trash2, User, Calendar } from "lucide-react";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string; postId: string }>;
}) {
  const { id, postId } = await params;

  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post || post.campaignId !== id) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/campaigns/${id}/posts`}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Posts
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/campaigns/${id}/posts/${postId}/edit`}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Link>
          <DeleteDialog
            title="Excluir Post"
            description={`Tem certeza que deseja excluir "${post.title}"?`}
            onConfirm={async () => {
              "use server";
              await deletePost(postId, id);
            }}
            trigger={
              <button className="flex items-center gap-2 rounded-lg border border-red-900/40 px-3 py-2 text-sm text-red-400 hover:border-red-700 hover:bg-red-950/20 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            }
          />
        </div>
      </div>

      <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden">
        {post.image && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-transparent to-transparent" />
          </div>
        )}

        <div className="p-8">
          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)] mb-4">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[var(--color-accent-purple)]" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[var(--color-accent-purple)]" />
              {formatDate(post.publishedAt)}
            </span>
          </div>

          <h1 className="font-fantasy text-3xl font-bold text-[var(--color-text-primary)] mb-8">
            {post.title}
          </h1>

          <div
            className="prose-rpg text-sm"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </div>
  );
}
