import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PostCard } from "@/components/post/PostCard";
import { Plus, FileText } from "lucide-react";

export default async function PostsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const posts = await prisma.post.findMany({
    where: { campaignId: id },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-fantasy text-2xl font-semibold text-[var(--color-text-primary)]">
          Posts & Histórias
        </h2>
        <Link
          href={`/campaigns/${id}/posts/new`}
          className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-purple)] px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[var(--color-border)] py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-elevated)]">
            <FileText className="h-8 w-8 text-[var(--color-text-muted)]" />
          </div>
          <div>
            <p className="font-fantasy text-lg font-semibold text-[var(--color-text-secondary)]">
              Nenhum post ainda
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Registre acontecimentos e histórias desta campanha.
            </p>
          </div>
          <Link
            href={`/campaigns/${id}/posts/new`}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-purple)] px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Criar Post
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} campaignId={id} />
          ))}
        </div>
      )}
    </div>
  );
}
