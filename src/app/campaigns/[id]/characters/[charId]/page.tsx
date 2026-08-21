import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { deleteCharacter } from "@/app/actions/characters";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Edit, User, Trash2 } from "lucide-react";

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string; charId: string }>;
}) {
  const { id, charId } = await params;

  const character = await prisma.character.findUnique({
    where: { id: charId },
  });

  if (!character || character.campaignId !== id) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/campaigns/${id}/characters`}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Personagens
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/campaigns/${id}/characters/${charId}/edit`}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Link>
          <DeleteDialog
            title="Excluir Personagem"
            description={`Tem certeza que deseja excluir "${character.name}"?`}
            onConfirm={async () => {
              "use server";
              await deleteCharacter(charId, id);
            }}
            trigger={
              <button className="flex items-center gap-2 rounded-lg border border-red-900/40 px-3 py-2 text-sm text-red-400 hover:border-red-700 hover:bg-red-950/20 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            }
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Portrait */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full max-w-sm rounded-xl overflow-hidden border border-[var(--color-border)]">
            {character.image ? (
              <Image
                src={character.image}
                alt={character.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-elevated)]">
                <User className="h-20 w-20 text-[var(--color-text-muted)]" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[var(--color-bg-elevated)] px-3 py-1 text-sm text-[var(--color-text-secondary)]">
                {character.race}
              </span>
              <span className="rounded-full bg-[var(--color-accent-purple)]/10 px-3 py-1 text-sm text-[var(--color-accent-purple)]">
                {character.characterClass}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">
              Jogador: {character.player}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Criado em: {formatDate(character.createdAt)}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
          <h1 className="font-fantasy text-3xl font-bold text-[var(--color-text-primary)] mb-6">
            {character.name}
          </h1>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
            Sobre o Personagem
          </h2>
          <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
            {character.description}
          </p>
        </div>
      </div>
    </div>
  );
}
