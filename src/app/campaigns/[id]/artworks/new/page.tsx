import { createArtwork } from "@/app/actions/artworks";
import { ArtworkForm } from "@/components/artwork/ArtworkForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewArtworkPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ folderId?: string }>;
}) {
  const { id } = await params;
  const { folderId } = await searchParams;

  return (
    <div className="form-page">
      <Link
        href={`/campaigns/${id}/artworks${folderId ? `?folder=${folderId}` : ""}`}
        className="btn btn-ghost mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <div className="paper">
        <p className="eyebrow">À mesa do escriba</p>
        <h1 className="form-title">Novo Desenho</h1>
        <ArtworkForm
          action={createArtwork.bind(null, id)}
          cancelHref={`/campaigns/${id}/artworks${folderId ? `?folder=${folderId}` : ""}`}
          defaultValues={{ folderId: folderId ?? "" }}
        />
      </div>
    </div>
  );
}
