import Image from "next/image";
import Link from "next/link";
import { Campaign } from "@/types";
import { Users, ImageIcon, FileText, Calendar } from "lucide-react";
import { formatDateShort } from "@/lib/utils";

interface CampaignCardProps {
  campaign: Campaign & {
    _count: {
      characters: number;
      npcs: number;
      artworks: number;
      sessions: number;
    };
  };
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Link href={`/campaigns/${campaign.id}`} className="group block">
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden hover:border-[var(--color-border-hover)] hover:shadow-lg hover:shadow-purple-950/20 transition-all duration-300">
        {/* Cover Image */}
        <div className="relative aspect-video overflow-hidden">
          {campaign.coverImage ? (
            <Image
              src={campaign.coverImage}
              alt={campaign.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-card)]">
              <ImageIcon className="h-12 w-12 text-[var(--color-text-muted)]" />
            </div>
          )}
          {/* System badge */}
          <div className="absolute top-3 right-3">
            <span className="rounded-full border border-[var(--color-accent-gold)]/40 bg-black/60 px-3 py-1 text-xs font-medium text-[var(--color-accent-gold-light)] backdrop-blur-sm">
              {campaign.system}
            </span>
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-fantasy text-xl font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-gold-light)] transition-colors line-clamp-1">
            {campaign.name}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
            <Calendar className="h-3 w-3" />
            <span>{formatDateShort(campaign.startDate)}</span>
          </div>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
            {campaign.description}
          </p>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-4 border-t border-[var(--color-border)] pt-4">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
              <Users className="h-3.5 w-3.5 text-[var(--color-accent-purple)]" />
              <span>{campaign._count.characters + campaign._count.npcs} personagens</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
              <ImageIcon className="h-3.5 w-3.5 text-[var(--color-accent-purple)]" />
              <span>{campaign._count.artworks} desenhos</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
              <FileText className="h-3.5 w-3.5 text-[var(--color-accent-purple)]" />
              <span>{campaign._count.sessions} sessões</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
