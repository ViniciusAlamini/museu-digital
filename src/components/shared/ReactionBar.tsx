"use client";

import { useTransition } from "react";
import { toggleReaction } from "@/app/actions/reactions";

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "👏"];

export function ReactionBar({
  campaignId,
  entityType,
  entityId,
  reactions,
  currentUser,
}: {
  campaignId: string;
  entityType: "artwork" | "npc" | "message" | "diaryEntry";
  entityId: string;
  reactions: { emoji: string; user: string }[];
  currentUser: string;
}) {
  const [isPending, startTransition] = useTransition();

  // Contar reações
  const counts = EMOJIS.map((emoji) => {
    const users = reactions.filter((r) => r.emoji === emoji).map((r) => r.user);
    const hasReacted = users.includes(currentUser);
    return { emoji, count: users.length, hasReacted };
  });

  const handleToggle = (emoji: string) => {
    startTransition(() => {
      toggleReaction(campaignId, entityType, entityId, emoji);
    });
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {counts.map((c) => {
        if (c.count === 0 && !c.hasReacted) {
          // Mostrar o botão sutil se não tem count
          return (
            <button
              key={c.emoji}
              onClick={() => handleToggle(c.emoji)}
              disabled={isPending || !currentUser}
              className="group flex items-center gap-1.5 rounded-full px-3 py-1 text-sm bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-accent-purple)]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all">
                {c.emoji}
              </span>
            </button>
          );
        }

        return (
          <button
            key={c.emoji}
            onClick={() => handleToggle(c.emoji)}
            disabled={isPending || !currentUser}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              c.hasReacted
                ? "bg-[var(--color-accent-purple)]/20 border-[var(--color-accent-purple)] text-[var(--color-accent-purple)] font-bold shadow-[0_0_10px_rgba(var(--color-accent-purple-rgb),0.2)]"
                : "bg-[var(--color-bg-elevated)] border-[var(--color-border)] hover:border-[var(--color-accent-purple)]/50"
            }`}
          >
            <span>{c.emoji}</span>
            <span className={c.hasReacted ? "text-purple-300" : "text-gray-400"}>
              {c.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
