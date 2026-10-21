import { prisma } from "@/lib/prisma";
import { createMessage } from "@/app/actions/messages";
import { MessageForm } from "@/components/message/MessageForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewMessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const characters = await prisma.character.findMany({
    where: { campaignId: id },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="form-page">
      <Link href={`/campaigns/${id}/messages`} className="btn btn-ghost mb-6">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <div className="paper">
        <p className="eyebrow">À mesa do escriba</p>
        <h1 className="form-title">Nova Mensagem</h1>
        <MessageForm
          action={createMessage.bind(null, id)}
          characters={characters}
          cancelHref={`/campaigns/${id}/messages`}
        />
      </div>
    </div>
  );
}
