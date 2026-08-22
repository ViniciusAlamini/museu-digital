import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CharacterCard } from "@/components/character/CharacterCard";
import { Plus, Users } from "lucide-react";
import { getSessionRole } from "@/lib/auth";

export default async function CharactersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const role = await getSessionRole();

  const characters = await prisma.character.findMany({
    where: { campaignId: id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-fantasy text-2xl font-semibold text-[var(--color-text-primary)]">
          Personagens
        </h2>
        {role !== "visitor" && (
          <Link
            href={`/campaigns/${id}/characters/new`}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-purple)] px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Link>
        )}
      </div>

      {characters.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[var(--color-border)] py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-elevated)]">
            <Users className="h-8 w-8 text-[var(--color-text-muted)]" />
          </div>
          <div>
            <p className="font-fantasy text-lg font-semibold text-[var(--color-text-secondary)]">
              Nenhum personagem ainda
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Adicione o primeiro personagem desta campanha.
            </p>
          </div>
          {role !== "visitor" && (
            <Link
              href={`/campaigns/${id}/characters/new`}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-purple)] px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Adicionar Personagem
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} campaignId={id} isAdmin={role === "admin"} />
          ))}
        </div>
      )}
    </div>
  );
}
