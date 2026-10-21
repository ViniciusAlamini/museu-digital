import { createPost } from "@/app/actions/posts";
import { PostForm } from "@/components/post/PostForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="form-page">
      <Link href={`/campaigns/${id}/posts`} className="btn btn-ghost mb-6">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <div className="paper">
        <p className="eyebrow">À mesa do escriba</p>
        <h1 className="form-title">Novo Post</h1>
        <PostForm
          action={createPost.bind(null, id)}
          cancelHref={`/campaigns/${id}/posts`}
        />
      </div>
    </div>
  );
}
