import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { CharacterCard } from "@/components/character/CharacterCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
export default async function CharactersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const characters = await prisma.character.findMany({
    where: { campaignId: id },
    orderBy: { createdAt: "asc" },
  });
  const action = (
    <Link href={`/campaigns/${id}/characters/new`} className="btn btn-primary">
      <Plus />
      Novo personagem
    </Link>
  );
  return (
    <section>
      <PageHeader
        eyebrow={`O elenco · ${characters.length} registros`}
        title="Personagens"
        description="Os nomes, os rostos e as histórias que dão vida a este mundo."
        action={action}
      />
      {characters.length ? (
        <div className="character-grid">
          {characters.map((c) => (
            <CharacterCard key={c.id} character={c} campaignId={id} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="Quem fará parte desta história?"
          description="Registre o primeiro personagem da campanha e comece a reunir o elenco."
          action={action}
        />
      )}
    </section>
  );
}
