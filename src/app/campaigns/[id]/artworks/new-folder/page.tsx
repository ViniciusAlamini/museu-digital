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
  const backHref = `/campaigns/${id}/artworks${parentId ? `?folder=${parentId}` : ""}`;

  const folders = await prisma.artworkFolder.findMany({
    where: { campaignId: id },
    orderBy: { name: "asc" },
  });

  const action = async (formData: FormData) => {
    "use server";
    const selectedParent =
      (formData.get("parentFolderId") as string) || undefined;
    await createArtworkFolder(id, selectedParent, formData);
    redirect(
      `/campaigns/${id}/artworks${selectedParent ? `?folder=${selectedParent}` : ""}`,
    );
  };

  return (
    <div className="form-page">
      <Link href={backHref} className="btn btn-ghost mb-6">
        <ArrowLeft className="h-5 w-5" />
        Voltar à galeria
      </Link>
      <div className="paper">
        <p className="eyebrow">À mesa do escriba</p>
        <h1 className="form-title">Nova pasta de desenhos</h1>
        <ArtworkFolderForm
          action={action}
          folders={folders.map((f: { id: string; name: string }) => ({
            id: f.id,
            name: f.name,
          }))}
          currentParentId={parentId}
          cancelHref={backHref}
        />
      </div>
    </div>
  );
}
