import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSessionRole } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { Plus, Calendar, Users, Scroll } from "lucide-react";

export default async function SessionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const role = await getSessionRole();

  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) notFound();

  const sessions = await prisma.session.findMany({
    where: { campaignId: id },
    orderBy: { date: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-fantasy text-2xl font-semibold text-[var(--color-text-primary)]">
            Sessões
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            {sessions.length} {sessions.length === 1 ? "sessão registrada" : "sessões registradas"}
          </p>
        </div>
        {role !== "visitor" && (
          <Link
            href={`/campaigns/${id}/sessions/new`}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-purple)] px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova Sessão
          </Link>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[var(--color-border)] py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-elevated)]">
            <Scroll className="h-8 w-8 text-[var(--color-text-muted)]" />
          </div>
          <div>
            <p className="font-fantasy text-lg font-semibold text-[var(--color-text-secondary)]">
              Nenhuma sessão registrada
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Registre a primeira sessão desta campanha.
            </p>
          </div>
          {role !== "visitor" && (
            <Link
              href={`/campaigns/${id}/sessions/new`}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-purple)] px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Registrar Sessão
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session, index) => {
            const participantList = session.participants
              ? session.participants.split(",").map((p) => p.trim()).filter(Boolean)
              : [];

            return (
              <Link
                key={session.id}
                href={`/campaigns/${id}/sessions/${session.id}`}
                className="group flex gap-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 hover:border-[var(--color-accent-purple)]/50 hover:bg-[var(--color-bg-elevated)] transition-all"
              >
                {/* Número da sessão (invertido por ser do mais recente) */}
                <div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-[var(--color-accent-purple)]/10 ring-2 ring-[var(--color-accent-purple)]/20">
                  <span className="text-xs text-[var(--color-text-muted)]">S</span>
                  <span className="text-sm font-bold text-[var(--color-accent-purple)] leading-none">
                    {sessions.length - index}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-fantasy text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-gold-light)] transition-colors line-clamp-1">
                    {session.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                    {session.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(session.date)}
                    </span>
                    {participantList.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {participantList.join(" · ")}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
