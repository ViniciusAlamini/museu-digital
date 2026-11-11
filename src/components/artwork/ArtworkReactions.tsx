"use client";

import { useOptimistic, useTransition } from "react";
import { toggleArtworkReaction } from "@/app/actions/artworkFeedback";
import { ARTWORK_REACTIONS, REACTION_LABELS } from "@/lib/reactions";

export type ReactionSummary = { emoji: string; users: string[] };

export function ArtworkReactions({
  campaignId,
  artworkId,
  currentUser,
  reactions,
}: {
  campaignId: string;
  artworkId: string;
  currentUser: string;
  reactions: ReactionSummary[];
}) {
  const [pending, startTransition] = useTransition();
  const [optimistic, toggle] = useOptimistic(reactions, (state, emoji: string) => {
    const existing = state.find((r) => r.emoji === emoji);
    if (!existing) return [...state, { emoji, users: [currentUser] }];
    const mine = existing.users.includes(currentUser);
    return state.map((r) =>
      r.emoji === emoji
        ? { ...r, users: mine ? r.users.filter((u) => u !== currentUser) : [...r.users, currentUser] }
        : r,
    );
  });

  return (
    <div className="artwork-reactions" role="group" aria-label="Reações" aria-busy={pending}>
      {ARTWORK_REACTIONS.map((emoji) => {
        const users = optimistic.find((r) => r.emoji === emoji)?.users ?? [];
        const mine = users.includes(currentUser);
        const label = REACTION_LABELS[emoji] ?? emoji;
        return (
          <button
            key={emoji}
            type="button"
            className="reaction-chip"
            aria-pressed={mine}
            aria-label={`${label}: ${users.length}${mine ? ", você reagiu" : ""}`}
            title={users.length ? users.join(", ") : label}
            onClick={() =>
              startTransition(async () => {
                toggle(emoji);
                await toggleArtworkReaction(campaignId, artworkId, emoji);
              })
            }
          >
            <span aria-hidden="true">{emoji}</span>
            {users.length > 0 && <span className="reaction-count">{users.length}</span>}
          </button>
        );
      })}
    </div>
  );
}
