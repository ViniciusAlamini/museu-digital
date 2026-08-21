import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateCampaign } from "@/app/actions/campaigns";
import { CampaignForm } from "@/components/campaign/CampaignForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href={`/campaigns/${id}`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
        <h1 className="font-fantasy text-3xl font-bold text-[var(--color-text-primary)] mb-8">
          Editar Campanha
        </h1>
        <CampaignForm
          action={updateCampaign.bind(null, id)}
          defaultValues={campaign}
          submitLabel="Salvar Alterações"
        />
      </div>
    </div>
  );
}
