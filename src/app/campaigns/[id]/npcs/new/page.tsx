import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getSessionRole } from "@/lib/auth";
import { createNpc } from "@/app/actions/npcs";
import { NpcForm } from "@/components/npc/NpcForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewNpcPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ folder?: string }>;
}) {
  const { id } = await params;
  const { folder } = await searchParams;
  const role = await getSessionRole();

  if (role === "visitor") redirect(`/campaigns/${id}/npcs`);

  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) notFound();

  const folders = await prisma.npcFolder.findMany({
    where: { campaignId: id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href={`/campaigns/${id}/npcs${folder ? `?folder=${folder}` : ""}`}
        className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 sm:p-8">
        <h1 className="font-fantasy text-2xl font-bold text-[var(--color-text-primary)] mb-6">
          Novo NPC
        </h1>

        <form action={createNpc.bind(null, id)}>
          <NpcForm folders={folders} defaultFolderId={folder} />
          
          <div className="mt-8 flex justify-end gap-3 border-t border-[var(--color-border)] pt-6">
            <Link
              href={`/campaigns/${id}/npcs${folder ? `?folder=${folder}` : ""}`}
              className="rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-[var(--color-accent-purple)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
            >
              Salvar NPC
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
