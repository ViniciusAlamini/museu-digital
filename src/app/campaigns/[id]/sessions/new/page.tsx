import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getSessionRole } from "@/lib/auth";
import { createSession } from "@/app/actions/sessions";
import { Scroll } from "lucide-react";

export default async function NewSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const role = await getSessionRole();

  if (role === "visitor") redirect(`/campaigns/${id}/sessions`);

  const characters = await prisma.character.findMany({
    where: { campaignId: id },
    orderBy: { name: "asc" },
  });

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-purple)]/10">
          <Scroll className="h-5 w-5 text-[var(--color-accent-purple)]" />
        </div>
        <div>
          <h1 className="font-fantasy text-2xl font-bold text-[var(--color-text-primary)]">
            Nova Sessão
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">Registre o que aconteceu na mesa</p>
        </div>
      </div>

      <form action={createSession.bind(null, id)} className="space-y-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Título da Sessão *
          </label>
          <input
            type="text"
            name="title"
            required
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-purple)] transition-colors"
            placeholder="Ex: A Floresta Amaldiçoada"
          />
        </div>

        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Data da Sessão *
          </label>
          <input
            type="date"
            name="date"
            required
            defaultValue={today}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-accent-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-purple)] transition-colors"
          />
        </div>

        {/* Jogadores presentes */}
        {characters.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-3">
              Jogadores Presentes
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {characters.map((char) => (
                <label
                  key={char.id}
                  className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 cursor-pointer hover:border-[var(--color-accent-purple)]/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    name="participants"
                    value={`${char.name} (${char.player})`}
                    className="h-4 w-4 rounded accent-purple-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{char.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{char.player}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Resumo */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Resumo da Sessão *
          </label>
          <textarea
            name="summary"
            required
            rows={8}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-purple)] transition-colors resize-none"
            placeholder="O que aconteceu nessa sessão? Batalhas, revelações, momentos marcantes..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <a
            href={`/campaigns/${id}/sessions`}
            className="rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Cancelar
          </a>
          <button
            type="submit"
            className="rounded-lg bg-[var(--color-accent-purple)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
          >
            Salvar Sessão
          </button>
        </div>
      </form>
    </div>
  );
}
