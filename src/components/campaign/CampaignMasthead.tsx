"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArchiveImage } from "@/components/shared/ArchiveImage";
import { CampaignTabs } from "./CampaignTabs";
import { formatDateShort } from "@/lib/utils";

export function CampaignMasthead({
  campaign,
}: {
  campaign: {
    id: string;
    name: string;
    system: string;
    coverImage: string | null;
    startDate: string;
  };
}) {
  const isOverview = usePathname() === `/campaigns/${campaign.id}`;
  return (
    <header className="campaign-opening">
      {isOverview ? (
        <>
          <div className="campaign-opening-image">
            <ArchiveImage
              src={campaign.coverImage}
              alt={campaign.name}
              variant="banner"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 80vw"
              priority
            />
          </div>
          <div className="campaign-opening-heading">
            <p className="eyebrow">Uma campanha de {campaign.system}</p>
            <h1>{campaign.name}</h1>
            <div className="campaign-opening-meta">
              <span>
                Crônicas iniciadas em {formatDateShort(campaign.startDate)}
              </span>
              <span aria-hidden="true">·</span>
              <span>Acervo da campanha</span>
            </div>
          </div>
        </>
      ) : (
        <div className="campaign-context">
          <span className="eyebrow">Neste volume</span>
          <Link href={`/campaigns/${campaign.id}`}>{campaign.name}</Link>
        </div>
      )}
      <CampaignTabs campaignId={campaign.id} />
    </header>
  );
}
