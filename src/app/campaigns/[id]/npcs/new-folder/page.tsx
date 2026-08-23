import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getSessionRole } from "@/lib/auth";
import { createNpcFolder } from "@/app/actions/npcFolders";
import Link from "next/link";
import { ArrowLeft, FolderPlus } from "lucide-react";

export default async function NewNpcFolderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ parent?: string }>;
}) {
  const { id } = await params;
  const { parent } = await searchParams;
  const role = await getSessionRole();

  if (role === "visitor") redirect(`/campaigns/${id}/npcs`);

  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) notFound();

  let parentFolder = null;
  if (parent) {
    parentFolder = await prisma.npcFolder.findUnique({ where: { id: parent } });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href={`/campaigns/${id}/npcs${parent ? `?folder=${parent}` : ""}`}
        className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-purple)]/10">
            <FolderPlus className="h-5 w-5 text-[var(--color-accent-purple)]" />
          </div>
          <div>
            <h1 className="font-fantasy text-2xl font-bold text-[var(--color-text-primary)]">
              Nova Pasta de NPCs
            </h1>
            {parentFolder && (
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                Criando dentro de: {parentFolder.name}
              </p>
            )}
          </div>
        </div>

        <form action={createNpcFolder.bind(null, id)} className="space-y-5">
          <input type="hidden" name="parentFolderId" value={parent || ""} />

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              Nome da Pasta *
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-accent-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-purple)]"
              placeholder="Ex: Vilões, Comerciantes, Aliados..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              Descrição (Opcional)
            </label>
            <input
              type="text"
              name="description"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-accent-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-purple)]"
            />
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-[var(--color-border)] pt-6">
            <Link
              href={`/campaigns/${id}/npcs${parent ? `?folder=${parent}` : ""}`}
              className="rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-[var(--color-accent-purple)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
            >
              Criar Pasta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
