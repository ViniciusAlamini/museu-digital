import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateDiaryEntry } from "@/app/actions/diaryEntries";
import { DiaryEntryForm } from "@/components/diary/DiaryEntryForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditDiaryEntryPage({
  params,
}: {
  params: Promise<{ id: string; entryId: string }>;
}) {
  const { id, entryId } = await params;

  const [entry, characters, folders] = await Promise.all([
    prisma.diaryEntry.findUnique({ where: { id: entryId } }),
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

  if (!entry || entry.campaignId !== id) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href={`/campaigns/${id}/diary/${entryId}`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para a Entrada
      </Link>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
        <h1 className="font-fantasy text-3xl font-bold text-[var(--color-text-primary)] mb-8">
          Editar Entrada
        </h1>
        <DiaryEntryForm
          action={updateDiaryEntry.bind(null, entryId, id)}
          defaultValues={entry}
          characters={characters}
          folders={folders}
          submitLabel="Salvar Alterações"
          cancelHref={`/campaigns/${id}/diary/${entryId}`}
        />
      </div>
    </div>
  );
}
