import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateMessage, deleteMessage } from "@/app/actions/messages";
import { MessageForm } from "@/components/message/MessageForm";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    <div className="form-page">
      <div className="detail-actions">
        <Link href={`/campaigns/${id}/messages`} className="btn btn-ghost">
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
        />
      </div>

      <div className="paper">
        <p className="eyebrow">À mesa do escriba</p>
        <h1 className="form-title">Editar Mensagem</h1>
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
