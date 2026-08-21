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
    <div className="max-w-2xl">
      <Link
        href={`/campaigns/${id}/messages`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
        <h1 className="font-fantasy text-3xl font-bold text-[var(--color-text-primary)] mb-8">
          Nova Mensagem
        </h1>
        <MessageForm
          action={createMessage.bind(null, id)}
          characters={characters}
          cancelHref={`/campaigns/${id}/messages`}
        />
      </div>
    </div>
  );
}
