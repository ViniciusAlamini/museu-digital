import Image from "next/image";
import Link from "next/link";
import { Character } from "@/types";
import { User } from "lucide-react";

interface CharacterCardProps {
  character: Character;
  campaignId: string;
}

export function CharacterCard({ character, campaignId }: CharacterCardProps) {
  return (
    <Link
      href={`/campaigns/${campaignId}/characters/${character.id}`}
      className="group block"
    >
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden hover:border-[var(--color-border-hover)] hover:shadow-lg hover:shadow-purple-950/20 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {character.image ? (
            <Image
              src={character.image}
              alt={character.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-card)]">
              <User className="h-16 w-16 text-[var(--color-text-muted)]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-transparent to-transparent" />
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-fantasy text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-gold-light)] transition-colors line-clamp-1">
            {character.name}
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Jogador: {character.player}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-[var(--color-bg-elevated)] px-2.5 py-0.5 text-xs text-[var(--color-text-secondary)]">
              {character.race}
            </span>
            <span className="rounded-full bg-[var(--color-accent-purple)]/10 px-2.5 py-0.5 text-xs text-[var(--color-accent-purple)]">
              {character.characterClass}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
