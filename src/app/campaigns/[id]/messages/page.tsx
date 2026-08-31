import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MessageCard } from "@/components/message/MessageCard";
import { Plus, MessageSquare } from "lucide-react";
import { getSession } from "@/lib/auth";

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  const messages = await prisma.message.findMany({
    where: { campaignId: id },
    orderBy: { createdAt: "desc" },
    include: {
      character: {
        select: { name: true, image: true },
      },
      reactions: true,
      comments: { orderBy: { createdAt: "asc" } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-fantasy text-2xl font-semibold text-[var(--color-text-primary)]">
          Mural de Mensagens
        </h2>
        <Link
          href={`/campaigns/${id}/messages/new`}
          className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-purple)] px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nova Mensagem
        </Link>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[var(--color-border)] py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-elevated)]">
            <MessageSquare className="h-8 w-8 text-[var(--color-text-muted)]" />
          </div>
          <div>
            <p className="font-fantasy text-lg font-semibold text-[var(--color-text-secondary)]">
              Nenhuma mensagem
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Seja o primeiro a deixar um recado ou pensamento.
            </p>
          </div>
          <Link
            href={`/campaigns/${id}/messages/new`}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-purple)] px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Escrever Mensagem
          </Link>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((msg) => (
            <MessageCard key={msg.id} message={msg} campaignId={id} currentUser={session.username || ""} />
          ))}
        </div>
      )}
    </div>
  );
}
