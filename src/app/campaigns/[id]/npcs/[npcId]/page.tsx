import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSessionRole } from "@/lib/auth";
import { deleteNpc } from "@/app/actions/npcs";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { ArrowLeft, Edit, Trash2, Users } from "lucide-react";

export default async function NpcDetailPage({
  params,
}: {
  params: Promise<{ id: string; npcId: string }>;
}) {
  const { id, npcId } = await params;
  const role = await getSessionRole();

  const npc = await prisma.npc.findUnique({
    where: { id: npcId },
    include: { folder: true },
  });

  if (!npc) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href={`/campaigns/${id}/npcs${npc.folderId ? `?folder=${npc.folderId}` : ""}`}
        className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para NPCs {npc.folder && `(${npc.folder.name})`}
      </Link>

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
        <div className="grid md:grid-cols-3">
          {/* Imagem */}
          <div className="relative aspect-square md:aspect-auto md:h-full min-h-[400px] border-b border-[var(--color-border)] md:border-b-0 md:border-r bg-[var(--color-bg-elevated)]">
            {npc.image ? (
              <Image
                src={npc.image}
                alt={npc.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-text-muted)]">
                <Users className="h-16 w-16 mb-4" />
                <p className="text-sm">Sem imagem</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-transparent to-transparent md:hidden" />
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col p-6 sm:p-8 md:col-span-2">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="font-fantasy text-3xl font-bold text-[var(--color-text-primary)]">
                  {npc.name}
                </h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  {npc.race && (
                    <span className="rounded-full bg-[var(--color-accent-purple)]/10 border border-[var(--color-accent-purple)]/20 px-3 py-1 text-sm font-medium text-[var(--color-accent-purple)]">
                      {npc.race}
                    </span>
                  )}
                  {npc.occupation && (
                    <span className="rounded-full bg-[var(--color-accent-gold)]/10 border border-[var(--color-accent-gold)]/20 px-3 py-1 text-sm font-medium text-[var(--color-accent-gold)]">
                      {npc.occupation}
                    </span>
                  )}
                </div>
              </div>

              {role !== "visitor" && (
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/campaigns/${id}/npcs/${npc.id}/edit`}
                    className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] p-2 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] transition-colors sm:px-4 sm:py-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="hidden sm:inline">Editar</span>
                  </Link>
                  <DeleteDialog
                    title="Excluir NPC"
                    description={`Tem certeza que deseja excluir "${npc.name}"? Esta ação não pode ser desfeita.`}
                    onConfirm={async () => {
                      "use server";
                      await deleteNpc(npc.id, id);
                    }}
                    trigger={
                      <button className="flex items-center gap-2 rounded-lg border border-red-900/40 p-2 text-sm text-red-400 hover:border-red-700 hover:bg-red-950/20 transition-colors sm:px-4 sm:py-2">
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Excluir</span>
                      </button>
                    }
                  />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="font-fantasy text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                Descrição / História
              </h2>
              <div className="prose prose-invert max-w-none text-[var(--color-text-secondary)]">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {npc.description}
                </p>
              </div>
            </div>

            {npc.addedBy && (
              <div className="mt-8 border-t border-[var(--color-border)] pt-6 text-right">
                <p className="text-xs text-[var(--color-text-muted)]">
                  ✍️ Adicionado por <span className="font-medium text-[var(--color-text-primary)]">{npc.addedBy}</span>
                  {npc.updatedBy && (
                    <>
                      {" · "}editado por <span className="font-medium text-[var(--color-text-primary)]">{npc.updatedBy}</span>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
