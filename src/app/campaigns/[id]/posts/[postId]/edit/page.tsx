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
    <div className="form-page">
      <Link
        href={`/campaigns/${id}/posts/${postId}`}
        className="btn btn-ghost mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <div className="paper">
        <p className="eyebrow">À mesa do escriba</p>
        <h1 className="form-title">Editar Post</h1>
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
