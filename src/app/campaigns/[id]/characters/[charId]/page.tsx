import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { deleteCharacter } from "@/app/actions/characters";
import { RecordActions } from "@/components/shared/RecordActions";
import { ArchiveImage } from "@/components/shared/ArchiveImage";
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
    <div>
      <RecordActions
        backHref={`/campaigns/${id}/characters`}
        backLabel="Todos os personagens"
        editHref={`/campaigns/${id}/characters/${charId}/edit`}
        deleteTitle="Excluir personagem"
        deleteDescription={`Deseja excluir “${character.name}” do acervo? Esta ação não pode ser desfeita.`}
        onDelete={async () => {
          "use server";
          await deleteCharacter(charId, id);
        }}
      />
      <article className="detail-grid">
        <div className="detail-portrait">
          <ArchiveImage
            src={character.image}
            alt={character.name}
            fill
            variant="portrait"
            className="object-cover"
            priority
          />
        </div>
        <div className="paper">
          <p className="eyebrow">Registro de personagem</p>
          <h1 className="detail-heading">{character.name}</h1>
          <dl className="catalog-properties">
            <div>
              <dt>Interpretado por</dt>
              <dd>{character.player}</dd>
            </div>
            <div>
              <dt>Raça</dt>
              <dd>{character.race}</dd>
            </div>
            <div>
              <dt>Classe</dt>
              <dd>{character.characterClass}</dd>
            </div>
          </dl>
          <h2 className="eyebrow mb-4">Sua história</h2>
          <p className="detail-description">{character.description}</p>
        </div>
      </article>
    </div>
  );
}
