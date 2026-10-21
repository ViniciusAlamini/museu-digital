import Link from "next/link";
import { ArrowUpRight, ImageIcon, Users } from "lucide-react";
import { ArchiveImage } from "@/components/shared/ArchiveImage";
import { Campaign } from "@/types";
import { formatDateShort } from "@/lib/utils";

type CampaignCardProps = {
  campaign: Campaign & {
    _count: { characters: number; artworks: number; posts: number };
  };
  index?: number;
};

export function CampaignCard({ campaign, index = 0 }: CampaignCardProps) {
  return (
    <Link href={`/campaigns/${campaign.id}`} className="campaign-volume">
      <div className="campaign-cover">
        <ArchiveImage
          src={campaign.coverImage}
          alt={campaign.name}
          fill
          variant="cover"
          className="object-cover"
        />
        <span className="campaign-cover-number">
          Vol. {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="campaign-caption">
        <div>
          <p className="eyebrow">{campaign.system}</p>
          <h2>{campaign.name}</h2>
          <div className="campaign-meta">
            <span>
              <Users />
              {campaign._count.characters} personagens
            </span>
            <span>
              <ImageIcon />
              {campaign._count.artworks} obras
            </span>
            <span>Desde {formatDateShort(campaign.startDate)}</span>
          </div>
        </div>
        <ArrowUpRight aria-hidden="true" />
      </div>
    </Link>
  );
}
