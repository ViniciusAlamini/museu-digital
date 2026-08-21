import { prisma } from "@/lib/prisma";
import { createDiaryFolder } from "@/app/actions/diaryFolders";
import { DiaryFolderForm } from "@/components/diary/DiaryFolderForm";
import Link from "next/link";
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

  return (
    <div className="max-w-2xl">
      <Link
        href={`/campaigns/${id}/diary${parentId ? `?folderId=${parentId}` : ""}`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para o Diário
      </Link>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
        <h1 className="font-fantasy text-3xl font-bold text-[var(--color-text-primary)] mb-8">
          Nova Pasta
        </h1>
        <DiaryFolderForm
          action={createDiaryFolder.bind(null, id, parentId)}
          folders={folders}
          currentParentId={parentId}
          cancelHref={`/campaigns/${id}/diary${parentId ? `?folderId=${parentId}` : ""}`}
        />
      </div>
    </div>
  );
}
