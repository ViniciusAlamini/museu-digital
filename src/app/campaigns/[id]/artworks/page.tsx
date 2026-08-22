import { prisma } from "@/lib/prisma";
import { ArtworkExplorer } from "@/components/artwork/ArtworkExplorer";

export default async function ArtworksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [folders, artworks] = await Promise.all([
    prisma.artworkFolder.findMany({
      where: { campaignId: id },
      orderBy: { name: "asc" },
    }),
    prisma.artwork.findMany({
      where: { campaignId: id },
      orderBy: { date: "desc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-fantasy text-2xl font-semibold text-[var(--color-text-primary)]">
          Acervo de Desenhos e Mapas
        </h2>
      </div>

      <ArtworkExplorer campaignId={id} folders={folders} artworks={artworks} />
    </div>
  );
}
