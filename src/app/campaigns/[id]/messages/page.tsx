import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, MessageSquare } from "lucide-react";
import { MessageCard } from "@/components/message/MessageCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
export default async function MessagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const messages = await prisma.message.findMany({
    where: { campaignId: id },
    orderBy: { createdAt: "desc" },
    include: { character: { select: { name: true, image: true } } },
  });
  const action = (
    <Link href={`/campaigns/${id}/messages/new`} className="btn btn-primary">
      <Plus />
      Nova mensagem
    </Link>
  );
  return (
    <section>
      <PageHeader
        eyebrow={`O correio · ${messages.length} registros`}
        title="Correspondências"
        description="Recados, pensamentos e palavras deixadas ao longo da jornada."
        action={action}
      />
      {messages.length ? (
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((m) => (
            <MessageCard key={m.id} message={m} campaignId={id} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="Nenhuma carta chegou ainda"
          description="Escreva uma mensagem, um pensamento ou uma lembrança de seu personagem."
          action={action}
        />
      )}
    </section>
  );
}
