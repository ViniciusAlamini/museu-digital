import Image from "next/image";
import Link from "next/link";
import { Artwork } from "@/types";
import { formatDateShort } from "@/lib/utils";

interface ArtworkCardProps {
  artwork: Artwork;
  campaignId: string;
}

export function ArtworkCard({ artwork, campaignId }: ArtworkCardProps) {
  return (
    <Link
      href={`/campaigns/${campaignId}/artworks/${artwork.id}`}
      className="group block"
    >
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden hover:border-[var(--color-border-hover)] hover:shadow-lg hover:shadow-purple-950/20 transition-all duration-300">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={artwork.image}
            alt={artwork.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
            <p className="text-xs text-white/80">Por {artwork.artist}</p>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-fantasy text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-gold-light)] transition-colors line-clamp-1">
            {artwork.title}
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            {formatDateShort(artwork.date)}
          </p>
        </div>
      </div>
    </Link>
  );
}
