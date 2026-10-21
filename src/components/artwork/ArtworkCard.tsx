import Link from "next/link";
import { Artwork } from "@/types";
import { ArchiveImage } from "@/components/shared/ArchiveImage";
import { formatDateShort } from "@/lib/utils";
export function ArtworkCard({
  artwork,
  campaignId,
}: {
  artwork: Artwork;
  campaignId: string;
}) {
  return (
    <Link
      href={`/campaigns/${campaignId}/artworks/${artwork.id}`}
      className="artwork-card"
    >
      <div className="artwork-image">
        <ArchiveImage
          src={artwork.image}
          alt={artwork.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="artwork-caption">
        <h3>{artwork.title}</h3>
        <p>
          {artwork.artist} <span aria-hidden="true">·</span>{" "}
          {formatDateShort(artwork.date)}
        </p>
      </div>
    </Link>
  );
}
