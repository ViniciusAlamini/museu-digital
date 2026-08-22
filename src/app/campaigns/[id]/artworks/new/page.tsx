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
    <div className="max-w-2xl">
      <Link
        href={`/campaigns/${id}/artworks${folderId ? `?folder=${folderId}` : ""}`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
        <h1 className="font-fantasy text-3xl font-bold text-[var(--color-text-primary)] mb-8">
          Novo Desenho
        </h1>
        <ArtworkForm
          action={createArtwork.bind(null, id)}
          cancelHref={`/campaigns/${id}/artworks${folderId ? `?folder=${folderId}` : ""}`}
          defaultValues={{ folderId: folderId ?? "" } as any}
        />
      </div>
    </div>
  );
}
