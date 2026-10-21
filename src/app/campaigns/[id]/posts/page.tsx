import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { PostCard } from "@/components/post/PostCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
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
  const action = (
    <Link href={`/campaigns/${id}/posts/new`} className="btn btn-primary">
      <Plus />
      Escrever história
    </Link>
  );
  return (
    <section>
      <PageHeader
        eyebrow={`As crônicas · ${posts.length} registros`}
        title="Posts & histórias"
        description="Acontecimentos, descobertas e relatos que merecem uma página própria."
        action={action}
      />
      {posts.length ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} campaignId={id} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="Uma história espera para ser contada"
          description="Guarde aqui os acontecimentos que marcaram a campanha."
          action={action}
        />
      )}
    </section>
  );
}
