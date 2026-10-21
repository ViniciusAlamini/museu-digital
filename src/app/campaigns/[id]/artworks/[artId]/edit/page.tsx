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
    <div className="form-page">
      <Link
        href={`/campaigns/${id}/artworks/${artId}`}
        className="btn btn-ghost mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <div className="paper">
        <p className="eyebrow">À mesa do escriba</p>
        <h1 className="form-title">Editar Desenho</h1>
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
