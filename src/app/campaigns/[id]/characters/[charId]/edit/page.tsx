import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateCharacter } from "@/app/actions/characters";
import { CharacterForm } from "@/components/character/CharacterForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditCharacterPage({
  params,
}: {
  params: Promise<{ id: string; charId: string }>;
}) {
  const { id, charId } = await params;
  const character = await prisma.character.findUnique({ where: { id: charId } });
  if (!character || character.campaignId !== id) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href={`/campaigns/${id}/characters/${charId}`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
        <h1 className="font-fantasy text-3xl font-bold text-[var(--color-text-primary)] mb-8">
          Editar Personagem
        </h1>
        <CharacterForm
          action={updateCharacter.bind(null, charId, id)}
          defaultValues={character}
          submitLabel="Salvar Alterações"
          cancelHref={`/campaigns/${id}/characters/${charId}`}
        />
      </div>
    </div>
  );
}
