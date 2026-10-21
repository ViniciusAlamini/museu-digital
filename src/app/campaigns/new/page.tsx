import { createCampaign } from "@/app/actions/campaigns";
import { CampaignForm } from "@/components/campaign/CampaignForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCampaignPage() {
  return (
    <div className="form-page">
      <Link href="/" className="btn btn-ghost mb-6">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <div className="paper">
        <p className="eyebrow">À mesa do escriba</p>
        <h1 className="form-title">Nova Campanha</h1>
        <CampaignForm action={createCampaign} />
      </div>
    </div>
  );
}
