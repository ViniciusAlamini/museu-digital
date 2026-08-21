import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { deleteDiaryEntry } from "@/app/actions/diaryEntries";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Edit, Trash2, User, Calendar, Folder } from "lucide-react";

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
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/campaigns/${id}/diary${entry.folderId ? `?folderId=${entry.folderId}` : ""}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o Diário
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/campaigns/${id}/diary/${entryId}/edit`}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Link>
          <DeleteDialog
            title="Excluir Entrada"
            description={`Tem certeza que deseja excluir "${entry.title}"?`}
            onConfirm={async () => {
              "use server";
              await deleteDiaryEntry(entryId, id, entry.folderId);
            }}
            trigger={
              <button className="flex items-center gap-2 rounded-lg border border-red-900/40 px-3 py-2 text-sm text-red-400 hover:border-red-700 hover:bg-red-950/20 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            }
          />
        </div>
      </div>

      <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)] mb-4 pb-4 border-b border-[var(--color-border)]">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-[var(--color-accent-purple)]" />
            {entry.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[var(--color-accent-purple)]" />
            {formatDate(entry.date)}
          </span>
          {entry.folder && (
            <span className="flex items-center gap-1.5">
              <Folder className="h-3.5 w-3.5 text-[var(--color-accent-gold-dark)]" />
              {entry.folder.name}
            </span>
          )}
          {entry.relatedCharacter && (
            <span className="flex items-center gap-1.5 bg-[var(--color-bg-elevated)] px-2 py-1 rounded">
              Personagem: <span className="font-medium text-[var(--color-text-primary)]">{entry.relatedCharacter.name}</span>
            </span>
          )}
        </div>

        <h1 className="font-fantasy text-4xl font-bold text-[var(--color-text-primary)] mb-8">
          {entry.title}
        </h1>

        {/* This styling handles tiptap images nicely out of the box because of .prose-img:rounded-lg etc in globals.css */}
        <div
          className="prose-rpg"
          dangerouslySetInnerHTML={{ __html: entry.content }}
        />
      </article>
    </div>
  );
}
