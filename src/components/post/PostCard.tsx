import Link from "next/link";
import { Post } from "@/types";
import { ArchiveImage } from "@/components/shared/ArchiveImage";
import { formatDateShort } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
export function PostCard({
  post,
  campaignId,
}: {
  post: Post;
  campaignId: string;
}) {
  const text = post.content
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
  return (
    <Link
      href={`/campaigns/${campaignId}/posts/${post.id}`}
      className="post-card"
    >
      {post.image && (
        <div className="post-card-image">
          <ArchiveImage
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="record-meta">
        <span>{formatDateShort(post.publishedAt)}</span>
        <span>Por {post.author}</span>
      </div>
      <h2>{post.title}</h2>
      <p className="line-clamp-3">
        {text.slice(0, 200)}
        {text.length > 200 ? "…" : ""}
      </p>
      <span className="mt-6 inline-flex items-center gap-2 text-xs text-[var(--wine)]">
        Ler esta história
        <ArrowUpRight size={14} />
      </span>
    </Link>
  );
}
