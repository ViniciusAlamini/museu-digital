import { createCharacter } from "@/app/actions/characters";
import { CharacterForm } from "@/components/character/CharacterForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewCharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-2xl">
      <Link
        href={`/campaigns/${id}/characters`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
        <h1 className="font-fantasy text-3xl font-bold text-[var(--color-text-primary)] mb-8">
          Novo Personagem
        </h1>
        <CharacterForm
          action={createCharacter.bind(null, id)}
          cancelHref={`/campaigns/${id}/characters`}
        />
      </div>
    </div>
  );
}
