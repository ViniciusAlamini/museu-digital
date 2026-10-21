import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CampaignMasthead } from "@/components/campaign/CampaignMasthead";
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
    <>
      <CampaignMasthead
        campaign={{
          id: campaign.id,
          name: campaign.name,
          system: campaign.system,
          coverImage: campaign.coverImage,
          startDate: campaign.startDate.toISOString(),
        }}
      />
      {children}
    </>
  );
}
