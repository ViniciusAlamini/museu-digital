import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateArtwork } from "@/app/actions/artworks";
import { ArtworkForm } from "@/components/artwork/ArtworkForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string; artId: string }>;
}) {
  const { id, artId } = await params;
  const artwork = await prisma.artwork.findUnique({ where: { id: artId } });
  if (!artwork || artwork.campaignId !== id) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href={`/campaigns/${id}/artworks/${artId}`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
        <h1 className="font-fantasy text-3xl font-bold text-[var(--color-text-primary)] mb-8">
          Editar Desenho
        </h1>
        <ArtworkForm
          action={updateArtwork.bind(null, artId, id)}
          defaultValues={artwork}
          submitLabel="Salvar Alterações"
          cancelHref={`/campaigns/${id}/artworks/${artId}`}
        />
      </div>
    </div>
  );
}
