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
    <div className="form-page">
      <Link href={`/campaigns/${id}`} className="btn btn-ghost mb-6">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <div className="paper">
        <p className="eyebrow">À mesa do escriba</p>
        <h1 className="form-title">Editar Campanha</h1>
        <CampaignForm
          action={updateCampaign.bind(null, id)}
          defaultValues={campaign}
          submitLabel="Salvar Alterações"
        />
      </div>
    </div>
  );
}
