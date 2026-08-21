import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArtworkCard } from "@/components/artwork/ArtworkCard";
import { Plus, ImageIcon } from "lucide-react";

export default async function ArtworksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const artworks = await prisma.artwork.findMany({
    where: { campaignId: id },
    orderBy: { date: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-fantasy text-2xl font-semibold text-[var(--color-text-primary)]">
          Galeria de Desenhos
        </h2>
        <Link
          href={`/campaigns/${id}/artworks/new`}
          className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-purple)] px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </Link>
      </div>

      {artworks.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[var(--color-border)] py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-elevated)]">
            <ImageIcon className="h-8 w-8 text-[var(--color-text-muted)]" />
          </div>
          <div>
            <p className="font-fantasy text-lg font-semibold text-[var(--color-text-secondary)]">
              Nenhum desenho ainda
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Adicione o primeiro desenho desta campanha.
            </p>
          </div>
          <Link
            href={`/campaigns/${id}/artworks/new`}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-purple)] px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Adicionar Desenho
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} campaignId={id} />
          ))}
        </div>
      )}
    </div>
  );
}
