"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArchiveImage } from "@/components/shared/ArchiveImage";
import { CampaignTabs } from "./CampaignTabs";
import { formatDateShort } from "@/lib/utils";
import { ArrowLeft, ArrowUpRight, Feather } from "lucide-react";

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
    <header className="campaign-opening" data-overview={isOverview}>
      {isOverview ? (
        <>
          <Link href="/" className="campaign-library-link">
            <ArrowLeft size={14} /> Voltar à biblioteca
          </Link>
          <div className="campaign-titlepage">
          <div className="campaign-opening-image">
            <ArchiveImage
              src={campaign.coverImage}
              alt={campaign.name}
              variant="cover"
              fill
              className="object-contain"
              sizes="(max-width: 639px) 180px, 240px"
              preload
            />
          </div>
          <div className="campaign-opening-heading">
            <p className="eyebrow">Um volume da nossa biblioteca</p>
            <h1>{campaign.name}</h1>
            <div className="campaign-opening-meta">
              <span>
                Crônicas iniciadas em {formatDateShort(campaign.startDate)}
              </span>
              <span aria-hidden="true">·</span>
              <span>{campaign.system}</span>
            </div>
            <div className="campaign-opening-actions">
              <Link href="#indice-da-aventura" className="btn btn-primary">
                Explorar a aventura <ArrowUpRight size={15} />
              </Link>
              <Link href={`/campaigns/${campaign.id}/diary/new-entry`} className="btn btn-secondary">
                <Feather size={15} /> Escrever no diário
              </Link>
            </div>
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
