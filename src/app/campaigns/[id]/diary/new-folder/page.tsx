import { prisma } from "@/lib/prisma";
import { createDiaryFolder } from "@/app/actions/diaryFolders";
import { DiaryFolderForm } from "@/components/diary/DiaryFolderForm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default async function NewDiaryFolderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ parentId?: string }>;
}) {
  const { id } = await params;
  const { parentId } = await searchParams;

  const folders = await prisma.diaryFolder.findMany({
    where: { campaignId: id },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  async function saveFolder(formData: FormData) {
    "use server";
    const selectedParent =
      (formData.get("parentFolderId") as string) || undefined;
    await createDiaryFolder(id, selectedParent, formData);
    redirect(
      `/campaigns/${id}/diary${selectedParent ? `?folderId=${selectedParent}` : ""}`,
    );
  }

  return (
    <div className="form-page">
      <Link
        href={`/campaigns/${id}/diary${parentId ? `?folderId=${parentId}` : ""}`}
        className="btn btn-ghost mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para o Diário
      </Link>
      <div className="paper">
        <p className="eyebrow">À mesa do escriba</p>
        <h1 className="form-title">Nova Pasta</h1>
        <DiaryFolderForm
          action={saveFolder}
          folders={folders}
          currentParentId={parentId}
          cancelHref={`/campaigns/${id}/diary${parentId ? `?folderId=${parentId}` : ""}`}
        />
      </div>
    </div>
  );
}
