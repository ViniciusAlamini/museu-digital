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
    <div className="max-w-3xl">
      <Link
        href={`/campaigns/${id}/diary${folderId ? `?folderId=${folderId}` : ""}`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para o Diário
      </Link>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
        <h1 className="font-fantasy text-3xl font-bold text-[var(--color-text-primary)] mb-8">
          Nova Entrada de Diário
        </h1>
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
