import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { deleteArtwork } from "@/app/actions/artworks";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Edit, Trash2, Palette, Calendar, User } from "lucide-react";
import { ReactionBar } from "@/components/shared/ReactionBar";
import { CommentSection } from "@/components/shared/CommentSection";
import { getSession } from "@/lib/auth";

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ id: string; artId: string }>;
}) {
  const { id, artId } = await params;
  const session = await getSession();

  const artwork = await prisma.artwork.findUnique({ 
    where: { id: artId },
    include: {
      comments: { orderBy: { createdAt: "asc" } },
      reactions: true,
    }
  });

  if (!artwork || artwork.campaignId !== id) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/campaigns/${id}/artworks`}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Galeria
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/campaigns/${id}/artworks/${artId}/edit`}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Link>
          <DeleteDialog
            title="Excluir Desenho"
            description={`Tem certeza que deseja excluir "${artwork.title}"?`}
            onConfirm={async () => {
              "use server";
              await deleteArtwork(artId, id);
            }}
            trigger={
              <button className="flex items-center gap-2 rounded-lg border border-red-900/40 px-3 py-2 text-sm text-red-400 hover:border-red-700 hover:bg-red-950/20 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            }
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Image & Comments */}
        <div className="space-y-6">
          <div className="relative w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
            <Image
              src={artwork.image}
              alt={artwork.title}
              width={1200}
              height={900}
              className="w-full h-auto"
            />
          </div>

          <CommentSection
            campaignId={id}
            entityType="artwork"
            entityId={artwork.id}
            comments={artwork.comments}
            currentUser={session.username || ""}
          />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
            <h1 className="font-fantasy text-2xl font-bold text-[var(--color-text-primary)] mb-4">
              {artwork.title}
            </h1>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <User className="h-4 w-4 text-[var(--color-accent-purple)]" />
                <span>{artwork.artist}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Calendar className="h-4 w-4 text-[var(--color-accent-purple)]" />
                <span>{formatDate(artwork.date)}</span>
              </div>
            </div>

            <ReactionBar
              campaignId={id}
              entityType="artwork"
              entityId={artwork.id}
              reactions={artwork.reactions}
              currentUser={session.username || ""}
            />
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="h-4 w-4 text-[var(--color-accent-gold)]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Descrição
              </h2>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
              {artwork.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
