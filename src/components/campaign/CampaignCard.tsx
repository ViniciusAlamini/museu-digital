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
  const name = campaign.name.toLocaleLowerCase("pt-BR");
  const theme = name.includes("strahd")
    ? "strahd"
    : name.includes("icewind") ? "icewind" : "archive";
  return (
    <Link
      href={`/campaigns/${campaign.id}`}
      className="campaign-volume"
      data-book-theme={theme}
    >
      <div className="campaign-book-display">
        <div className="campaign-cover">
          <ArchiveImage
            src={campaign.coverImage}
            alt={campaign.name}
            fill
            variant="cover"
            className="object-cover"
          />
          <span className="campaign-cover-number">
            Volume {String(index + 1).padStart(2, "0")}
          </span>
          <div className="book-cover-type" aria-hidden="true">
            <span className="book-cover-series">Crônicas de nossas mesas</span>
            <span className="book-cover-title">{campaign.name}</span>
            <span className="book-cover-flourish">✦</span>
            <span className="book-cover-edition">{campaign.system} · Museu Digital</span>
          </div>
          <span className="book-cover-corners" aria-hidden="true" />
        </div>
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
