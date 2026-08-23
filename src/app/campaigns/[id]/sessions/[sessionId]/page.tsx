import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSessionRole } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { deleteSession } from "@/app/actions/sessions";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { Calendar, Users, Edit, Trash2, ArrowLeft, Scroll } from "lucide-react";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string; sessionId: string }>;
}) {
  const { id, sessionId } = await params;
  const role = await getSessionRole();

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { campaign: { select: { name: true } } },
  });

  if (!session) notFound();

  // Número da sessão (posição cronológica)
  const allSessions = await prisma.session.findMany({
    where: { campaignId: id },
    orderBy: { date: "asc" },
    select: { id: true },
  });
  const sessionNumber = allSessions.findIndex((s) => s.id === sessionId) + 1;

  const participantList = session.participants
    ? session.participants.split(",").map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Voltar */}
      <Link
        href={`/campaigns/${id}/sessions`}
        className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Todas as Sessões
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-[var(--color-accent-purple)]/10 ring-2 ring-[var(--color-accent-purple)]/20 shrink-0">
              <Scroll className="h-4 w-4 text-[var(--color-accent-purple)] mb-0.5" />
              <span className="text-xs font-bold text-[var(--color-accent-purple)] leading-none">
                #{sessionNumber}
              </span>
            </div>
            <div>
              <h1 className="font-fantasy text-2xl font-bold text-[var(--color-text-primary)]">
                {session.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(session.date)}
                </span>
                {participantList.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {participantList.length} {participantList.length === 1 ? "jogador" : "jogadores"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {role !== "visitor" && (
            <div className="flex shrink-0 gap-2">
              <Link
                href={`/campaigns/${id}/sessions/${sessionId}/edit`}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Link>
              <DeleteDialog
                title="Excluir Sessão"
                description={`Tem certeza que deseja excluir a sessão "${session.title}"? Esta ação não pode ser desfeita.`}
                onConfirm={async () => {
                  "use server";
                  await deleteSession(sessionId, id);
                }}
                trigger={
                  <button className="flex items-center gap-1.5 rounded-lg border border-red-900/40 px-3 py-2 text-sm text-red-400 hover:border-red-700 hover:bg-red-950/20 transition-colors">
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </button>
                }
              />
            </div>
          )}
        </div>

        {/* Participantes */}
        {participantList.length > 0 && (
          <div className="border-t border-[var(--color-border)] pt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
              Presentes nesta sessão
            </p>
            <div className="flex flex-wrap gap-2">
              {participantList.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-[var(--color-accent-purple)]/10 border border-[var(--color-accent-purple)]/20 px-3 py-1 text-sm text-[var(--color-accent-purple)]"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Resumo */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
        <h2 className="font-fantasy text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          Resumo
        </h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
          {session.summary}
        </p>
      </div>

      {/* Rodapé de auditoria */}
      {session.addedBy && (
        <p className="text-xs text-[var(--color-text-muted)] text-right">
          ✍️ Registrado por <strong>{session.addedBy}</strong>
          {session.updatedBy && ` · editado por ${session.updatedBy}`}
        </p>
      )}
    </div>
  );
}
