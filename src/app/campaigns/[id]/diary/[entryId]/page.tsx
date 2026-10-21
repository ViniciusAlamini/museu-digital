import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { deleteDiaryEntry } from "@/app/actions/diaryEntries";
import { RecordActions } from "@/components/shared/RecordActions";
import { RichContent } from "@/components/shared/RichContent";
import { formatDate } from "@/lib/utils";
export default async function DiaryEntryDetailPage({
  params,
}: {
  params: Promise<{ id: string; entryId: string }>;
}) {
  const { id, entryId } = await params;
  const entry = await prisma.diaryEntry.findUnique({
    where: { id: entryId },
    include: { folder: true, relatedCharacter: true },
  });
  if (!entry || entry.campaignId !== id) notFound();
  return (
    <div>
      <RecordActions
        backHref={`/campaigns/${id}/diary${entry.folderId ? "?folderId=" + entry.folderId : ""}`}
        backLabel="Voltar ao diário"
        editHref={`/campaigns/${id}/diary/${entryId}/edit`}
        deleteTitle="Excluir registro"
        deleteDescription={`Deseja excluir “${entry.title}”? Esta ação não pode ser desfeita.`}
        onDelete={async () => {
          "use server";
          await deleteDiaryEntry(entryId, id, entry.folderId);
        }}
      />
      <article className="reading-sheet">
        <p className="eyebrow">
          Páginas do diário{entry.folder ? ` · ${entry.folder.name}` : ""}
        </p>
        <h1>{entry.title}</h1>
        <div className="record-meta">
          <span>Por {entry.author}</span>
          <span>{formatDate(entry.date)}</span>
          {entry.relatedCharacter && (
            <span>Sobre {entry.relatedCharacter.name}</span>
          )}
        </div>
        <RichContent html={entry.content} className="mt-8" />
      </article>
    </div>
  );
}
