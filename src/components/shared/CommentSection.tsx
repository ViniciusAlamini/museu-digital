"use client";

import { useTransition, useRef } from "react";
import { addComment, deleteComment } from "@/app/actions/comments";
import { Send, Trash2 } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

export function CommentSection({
  campaignId,
  entityType,
  entityId,
  comments,
  currentUser,
}: {
  campaignId: string;
  entityType: "artwork" | "npc" | "message" | "diaryEntry";
  entityId: string;
  comments: { id: string; content: string; author: string; createdAt: Date }[];
  currentUser: string;
}) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get("content") as string;
    
    if (!content.trim()) return;

    startTransition(() => {
      addComment(campaignId, entityType, entityId, content).then(() => {
        formRef.current?.reset();
      });
    });
  };

  const handleDelete = (commentId: string) => {
    if (!confirm("Tem certeza que deseja apagar este comentário?")) return;
    startTransition(() => {
      deleteComment(campaignId, commentId);
    });
  };

  return (
    <div className="mt-8 space-y-6">
      <h3 className="font-fantasy text-xl font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">
        Comentários ({comments.length})
      </h3>

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="group relative rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[var(--color-accent-purple)]">{c.author}</span>
              <span className="text-xs text-[var(--color-text-muted)]">{formatTimeAgo(c.createdAt)}</span>
            </div>
            <p className="text-[var(--color-text-secondary)] whitespace-pre-wrap text-sm leading-relaxed">
              {c.content}
            </p>
            {c.author === currentUser && (
              <button
                onClick={() => handleDelete(c.id)}
                disabled={isPending}
                className="absolute top-4 right-4 text-red-400/0 group-hover:text-red-400/70 hover:!text-red-400 transition-colors disabled:opacity-50"
                title="Apagar comentário"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-center text-sm text-[var(--color-text-muted)] py-4 italic">
            Nenhum comentário ainda. Seja o primeiro a falar!
          </p>
        )}
      </div>

      {currentUser ? (
        <form ref={formRef} onSubmit={handleSubmit} className="relative mt-4">
          <textarea
            name="content"
            placeholder="Deixe um comentário..."
            disabled={isPending}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 pr-12 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-purple)] resize-none"
            rows={3}
            required
          />
          <button
            type="submit"
            disabled={isPending}
            className="absolute bottom-4 right-4 rounded-lg bg-[var(--color-accent-purple)] p-2 text-white hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <div className="mt-4 p-4 text-center text-sm text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] rounded-xl border border-[var(--color-border)]">
          Faça login para comentar.
        </div>
      )}
    </div>
  );
}
