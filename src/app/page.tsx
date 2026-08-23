import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CampaignCard } from "@/components/campaign/CampaignCard";
import { Plus, Swords } from "lucide-react";

export const revalidate = 0;

export default async function HomePage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          characters: true,
          artworks: true,
          sessions: true,
        },
      },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-12">
        <div>
          <h1 className="font-fantasy text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl">
            Acervo de Campanhas
          </h1>
          <p className="mt-3 text-[var(--color-text-secondary)] max-w-xl">
            Todas as suas aventuras, personagens e histórias em um só lugar.
          </p>
        </div>
        <Link
          href="/campaigns/new"
          className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-purple)] px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition-colors shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Criar Campanha
        </Link>
      </div>

      {/* Campaigns grid */}
      {campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 rounded-xl border border-dashed border-[var(--color-border)] py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-bg-elevated)]">
            <Swords className="h-10 w-10 text-[var(--color-text-muted)]" />
          </div>
          <div>
            <p className="font-fantasy text-xl font-semibold text-[var(--color-text-secondary)]">
              Nenhuma campanha ainda
            </p>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Crie sua primeira campanha para começar o acervo.
            </p>
          </div>
          <Link
            href="/campaigns/new"
            className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-purple)] px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Criar Campanha
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
}
