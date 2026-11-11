import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { deleteArtwork } from "@/app/actions/artworks";
import { RecordActions } from "@/components/shared/RecordActions";
import { ArchiveImage } from "@/components/shared/ArchiveImage";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { ArtworkReactions, type ReactionSummary } from "@/components/artwork/ArtworkReactions";
import { ArtworkComments } from "@/components/artwork/ArtworkComments";
export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ id: string; artId: string }>;
}) {
  const { id, artId } = await params;
  const [artwork, user] = await Promise.all([
    prisma.artwork.findUnique({
      where: { id: artId },
      include: {
        comments: { orderBy: { createdAt: "asc" } },
        reactions: { select: { emoji: true, user: true } },
      },
    }),
    getCurrentUser(),
  ]);
  if (!artwork || artwork.campaignId !== id) notFound();
  const reactions: ReactionSummary[] = [];
  for (const r of artwork.reactions) {
    const name = r.user.trim();
    const group = reactions.find((g) => g.emoji === r.emoji);
    if (!group) reactions.push({ emoji: r.emoji, users: [name] });
    else if (!group.users.includes(name)) group.users.push(name);
  }
  const comments = artwork.comments.map((c) => ({
    id: c.id,
    author: c.author.trim(),
    content: c.content,
    createdAt: c.createdAt.toISOString(),
    canDelete: !!user && (user.role === "ADMIN" || c.author.trim() === user.username),
  }));
  const back = `/campaigns/${id}/artworks${artwork.folderId ? "?folder=" + artwork.folderId : ""}`;
  return (
    <div>
      <RecordActions
        backHref={back}
        backLabel="Voltar à galeria"
        editHref={`/campaigns/${id}/artworks/${artId}/edit`}
        deleteTitle="Excluir desenho"
        deleteDescription={`Deseja excluir “${artwork.title}”? Esta ação não pode ser desfeita.`}
        onDelete={async () => {
          "use server";
          await deleteArtwork(artId, id);
        }}
      />
      <article>
        <div className="artwork-detail-image">
          <ArchiveImage
            src={artwork.image}
            alt={artwork.title}
            width={1400}
            height={1000}
            className="w-full h-auto"
            sizes="(max-width: 1024px) 100vw, 80vw"
            priority
          />
        </div>
        <div className="artwork-detail-caption">
          <div>
            <p className="eyebrow">Uma obra do acervo</p>
            <h1 className="detail-heading">{artwork.title}</h1>
            <p className="detail-description">{artwork.description}</p>
          </div>
          <dl className="catalog-properties">
            <div>
              <dt>Artista</dt>
              <dd>{artwork.artist}</dd>
            </div>
            <div>
              <dt>Data da obra</dt>
              <dd>{formatDate(artwork.date)}</dd>
            </div>
          </dl>
        </div>
      </article>
      <div className="artwork-feedback">
        {user && (
          <ArtworkReactions
            campaignId={id}
            artworkId={artId}
            currentUser={user.username}
            reactions={reactions}
          />
        )}
        <ArtworkComments campaignId={id} artworkId={artId} comments={comments} />
      </div>
    </div>
  );
}
