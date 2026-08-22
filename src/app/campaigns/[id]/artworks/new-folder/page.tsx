import { prisma } from "@/lib/prisma";
import { ArtworkFolderForm } from "@/components/artwork/ArtworkFolderForm";
import { createArtworkFolder } from "@/app/actions/artworkFolders";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewArtworkFolderPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ parentId?: string }>;
}) {
  const { id } = await props.params;
  const { parentId } = await props.searchParams;

  const folders = await prisma.artworkFolder.findMany({
    where: { campaignId: id },
    orderBy: { name: "asc" },
  });

  const action = async (formData: FormData) => {
    "use server";
    await createArtworkFolder(id, formData.get("parentFolderId") as string | undefined, formData);
    redirect(`/campaigns/${id}/artworks${parentId ? `?folder=${parentId}` : ""}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/campaigns/${id}/artworks`}
          className="p-2 rounded-lg hover:bg-[var(--color-bg-elevated)] transition-colors text-[var(--color-text-secondary)]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="font-fantasy text-2xl font-semibold text-[var(--color-text-primary)]">
          Nova Pasta
        </h2>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
        <ArtworkFolderForm
          action={action}
          folders={folders.map(f => ({ id: f.id, name: f.name }))}
          currentParentId={parentId}
          cancelHref={`/campaigns/${id}/artworks`}
        />
      </div>
    </div>
  );
}
