import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CampaignTabs } from "@/components/campaign/CampaignTabs";

export default async function CampaignLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) notFound();

  return (
    <div>
      {/* Campaign Header / Banner */}
      <div className="relative min-h-[260px] overflow-hidden">
        {campaign.coverImage ? (
          <>
            <img
              src={campaign.coverImage}
              alt={campaign.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-[var(--color-bg-primary)]/70 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-elevated)] via-purple-950/20 to-[var(--color-bg-primary)]" />
        )}
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <span className="inline-block rounded-full border border-[var(--color-accent-gold)]/40 px-3 py-1 text-xs font-medium text-[var(--color-accent-gold-light)] mb-3">
            {campaign.system}
          </span>
          <h1 className="font-fantasy text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl drop-shadow-lg">
            {campaign.name}
          </h1>
        </div>
      </div>

      <CampaignTabs campaignId={id} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
