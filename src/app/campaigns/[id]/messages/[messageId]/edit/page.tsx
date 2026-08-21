import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateMessage, deleteMessage } from "@/app/actions/messages";
import { MessageForm } from "@/components/message/MessageForm";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";

export default async function EditMessagePage({
  params,
}: {
  params: Promise<{ id: string; messageId: string }>;
}) {
  const { id, messageId } = await params;
  
  const [message, characters] = await Promise.all([
    prisma.message.findUnique({ where: { id: messageId } }),
    prisma.character.findMany({
      where: { campaignId: id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!message || message.campaignId !== id) notFound();

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href={`/campaigns/${id}/messages`}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <DeleteDialog
          title="Excluir Mensagem"
          description="Tem certeza que deseja excluir esta mensagem?"
          onConfirm={async () => {
            "use server";
            await deleteMessage(messageId, id);
          }}
          trigger={
            <button className="flex items-center gap-2 rounded-lg border border-red-900/40 px-3 py-2 text-sm text-red-400 hover:border-red-700 hover:bg-red-950/20 transition-colors">
              <Trash2 className="h-4 w-4" />
              Excluir
            </button>
          }
        />
      </div>
      
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
        <h1 className="font-fantasy text-3xl font-bold text-[var(--color-text-primary)] mb-8">
          Editar Mensagem
        </h1>
        <MessageForm
          action={updateMessage.bind(null, messageId, id)}
          defaultValues={message}
          characters={characters}
          submitLabel="Salvar Alterações"
          cancelHref={`/campaigns/${id}/messages`}
        />
      </div>
    </div>
  );
}
