import { prisma } from "@/lib/prisma";
import { ArtworkExplorer } from "@/components/artwork/ArtworkExplorer";
import { PageHeader } from "@/components/shared/PageHeader";
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
    <section>
      <PageHeader
        eyebrow={`O atlas · ${artworks.length} obras`}
        title="Desenhos & mapas"
        description="Lugares, criaturas e visões que ganharam forma fora da imaginação."
      />
      <ArtworkExplorer campaignId={id} folders={folders} artworks={artworks} />
    </section>
  );
}
