import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { deletePost } from "@/app/actions/posts";
import { RecordActions } from "@/components/shared/RecordActions";
import { ArchiveImage } from "@/components/shared/ArchiveImage";
import { RichContent } from "@/components/shared/RichContent";
import { formatDate } from "@/lib/utils";
export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string; postId: string }>;
}) {
  const { id, postId } = await params;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.campaignId !== id) notFound();
  return (
    <div>
      <RecordActions
        backHref={`/campaigns/${id}/posts`}
        backLabel="Todas as histórias"
        editHref={`/campaigns/${id}/posts/${postId}/edit`}
        deleteTitle="Excluir história"
        deleteDescription={`Deseja excluir “${post.title}”? Esta ação não pode ser desfeita.`}
        onDelete={async () => {
          "use server";
          await deletePost(postId, id);
        }}
      />
      <article className="reading-sheet">
        <p className="eyebrow">Crônicas da campanha</p>
        <h1>{post.title}</h1>
        <div className="record-meta">
          <span>Por {post.author}</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
        {post.image && (
          <div className="post-card-image mt-8">
            <ArchiveImage
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <RichContent html={post.content} className="mt-8" />
      </article>
    </div>
  );
}
