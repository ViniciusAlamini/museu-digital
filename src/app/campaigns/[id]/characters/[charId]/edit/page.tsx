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
  const character = await prisma.character.findUnique({
    where: { id: charId },
  });
  if (!character || character.campaignId !== id) notFound();

  return (
    <div className="form-page">
      <Link
        href={`/campaigns/${id}/characters/${charId}`}
        className="btn btn-ghost mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <div className="paper">
        <p className="eyebrow">À mesa do escriba</p>
        <h1 className="form-title">Editar Personagem</h1>
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
