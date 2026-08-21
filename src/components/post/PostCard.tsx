import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types";
import { formatDate } from "@/lib/utils";
import { User, Calendar } from "lucide-react";

interface PostCardProps {
  post: Post;
  campaignId: string;
}

export function PostCard({ post, campaignId }: PostCardProps) {
  // Strip HTML tags for preview
  const preview = post.content.replace(/<[^>]+>/g, "").slice(0, 180);

  return (
    <Link
      href={`/campaigns/${campaignId}/posts/${post.id}`}
      className="group block"
    >
      <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden hover:border-[var(--color-border-hover)] hover:shadow-lg hover:shadow-purple-950/20 transition-all duration-300">
        {post.image && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-transparent to-transparent" />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)] mb-3">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(post.publishedAt)}
            </span>
          </div>
          <h3 className="font-fantasy text-xl font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-gold-light)] transition-colors mb-3">
            {post.title}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-3">
            {preview}
            {post.content.replace(/<[^>]+>/g, "").length > 180 && "..."}
          </p>
        </div>
      </article>
    </Link>
  );
}
