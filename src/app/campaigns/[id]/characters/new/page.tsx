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
    <div className="form-page">
      <Link href={`/campaigns/${id}/characters`} className="btn btn-ghost mb-6">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <div className="paper">
        <p className="eyebrow">À mesa do escriba</p>
        <h1 className="form-title">Novo Personagem</h1>
        <CharacterForm
          action={createCharacter.bind(null, id)}
          cancelHref={`/campaigns/${id}/characters`}
        />
      </div>
    </div>
  );
}
