"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { DiaryFolder, DiaryEntry } from "@/types";
import { deleteDiaryFolder } from "@/app/actions/diaryFolders";
import { FolderExplorer } from "@/components/shared/FolderExplorer";

interface DiaryExplorerProps {
  campaignId: string;
  folders: DiaryFolder[];
  entries: DiaryEntry[];
}

export function DiaryExplorer({
  campaignId,
  folders,
  entries,
}: DiaryExplorerProps) {
  const basePath = `/campaigns/${campaignId}/diary`;

  return (
    <FolderExplorer
      basePath={basePath}
      folderParam="folderId"
      folders={folders}
      items={entries}
      rootLabel="Raiz do diário"
      itemLabel="entradas"
      newItemPath="new-entry"
      newItemLabel="Nova entrada"
      emptyTitle="As próximas páginas esperam sua história"
      emptyDescription="Registre um acontecimento da campanha ou crie uma pasta para organizar as entradas deste diário."
      onDeleteFolder={(folderId) => deleteDiaryFolder(folderId, campaignId)}
    >
      {(folderId) => (
        <div className="explorer-entries">
          {entries
            .filter((entry) => (entry.folderId || null) === folderId)
            .map((entry, index) => (
              <Link
                key={entry.id}
                href={`${basePath}/${entry.id}`}
                className="explorer-entry"
              >
                <span className="folio-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="explorer-entry-content">
                  <span className="eyebrow">
                    <FileText size={13} aria-hidden="true" /> Registro do diário
                  </span>
                  <h3>{entry.title}</h3>
                  <p>
                    <time dateTime={new Date(entry.date).toISOString()}>
                      {formatDate(entry.date)}
                    </time>
                    <span aria-hidden="true"> · </span>
                    {entry.author}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      )}
    </FolderExplorer>
  );
}
