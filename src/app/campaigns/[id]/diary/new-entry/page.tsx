import { prisma } from "@/lib/prisma";
import { createDiaryEntry } from "@/app/actions/diaryEntries";
import { DiaryEntryForm } from "@/components/diary/DiaryEntryForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewDiaryEntryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ folderId?: string }>;
}) {
  const { id } = await params;
  const { folderId } = await searchParams;

  const [characters, folders] = await Promise.all([
    prisma.character.findMany({
      where: { campaignId: id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.diaryFolder.findMany({
      where: { campaignId: id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="form-page">
      <Link
        href={`/campaigns/${id}/diary${folderId ? `?folderId=${folderId}` : ""}`}
        className="btn btn-ghost mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para o Diário
      </Link>
      <div className="paper">
        <p className="eyebrow">À mesa do escriba</p>
        <h1 className="form-title">Nova Entrada de Diário</h1>
        <DiaryEntryForm
          action={createDiaryEntry.bind(null, id)}
          characters={characters}
          folders={folders}
          currentFolderId={folderId}
          cancelHref={`/campaigns/${id}/diary${folderId ? `?folderId=${folderId}` : ""}`}
        />
      </div>
    </div>
  );
}
