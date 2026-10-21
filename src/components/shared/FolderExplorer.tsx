"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowUp,
  ChevronRight,
  Folder,
  FolderOpen,
  FolderPlus,
  Plus,
} from "lucide-react";
import { DeleteDialog } from "./DeleteDialog";
import { EmptyState } from "./EmptyState";

interface ExplorerFolder {
  id: string;
  name: string;
  parentFolderId?: string | null;
  description?: string | null;
}

interface FolderExplorerProps {
  basePath: string;
  folderParam: "folderId" | "folder";
  folders: ExplorerFolder[];
  items: { folderId?: string | null }[];
  rootLabel: string;
  itemLabel: string;
  newItemPath: string;
  newItemLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  onDeleteFolder: (folderId: string) => Promise<void>;
  children: (folderId: string | null) => ReactNode;
}

export function FolderExplorer({
  basePath,
  folderParam,
  folders,
  items,
  rootLabel,
  itemLabel,
  newItemPath,
  newItemLabel,
  emptyTitle,
  emptyDescription,
  onDeleteFolder,
  children,
}: FolderExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectId = useId();
  const titleId = useId();
  const currentFolderId = searchParams.get(folderParam) || null;
  const folderMap = new Map(folders.map((folder) => [folder.id, folder]));
  const currentFolder = currentFolderId
    ? folderMap.get(currentFolderId)
    : undefined;
  const missingFolder = Boolean(currentFolderId && !currentFolder);
  const subfolders = folders.filter(
    (folder) => (folder.parentFolderId || null) === currentFolderId,
  );
  const currentItems = items.filter(
    (item) => (item.folderId || null) === currentFolderId,
  );
  const folderHref = (folderId: string | null) =>
    folderId
      ? `${basePath}?${folderParam}=${encodeURIComponent(folderId)}`
      : basePath;

  function ancestorsOf(folder: ExplorerFolder) {
    const ancestors: ExplorerFolder[] = [];
    const visited = new Set<string>();
    let ancestor: ExplorerFolder | undefined = folder;
    while (ancestor && !visited.has(ancestor.id)) {
      visited.add(ancestor.id);
      ancestors.unshift(ancestor);
      ancestor = ancestor.parentFolderId
        ? folderMap.get(ancestor.parentFolderId)
        : undefined;
    }
    return ancestors;
  }

  const ancestors = currentFolder ? ancestorsOf(currentFolder) : [];
  const parentFolderId =
    currentFolder?.parentFolderId && folderMap.has(currentFolder.parentFolderId)
      ? currentFolder.parentFolderId
      : null;
  const indexFolders: { folder: ExplorerFolder; depth: number }[] = [];
  const indexed = new Set<string>();
  function appendBranch(folder: ExplorerFolder, depth: number) {
    if (indexed.has(folder.id)) return;
    indexed.add(folder.id);
    indexFolders.push({ folder, depth });
    folders
      .filter((child) => child.parentFolderId === folder.id)
      .forEach((child) => appendBranch(child, depth + 1));
  }
  folders
    .filter(
      (folder) =>
        !folder.parentFolderId || !folderMap.has(folder.parentFolderId),
    )
    .forEach((folder) => appendBranch(folder, 0));
  folders.forEach((folder) => appendBranch(folder, 0));

  const newFolderHref = `${basePath}/new-folder${currentFolder ? `?parentId=${encodeURIComponent(currentFolder.id)}` : ""}`;
  const newItemHref = `${basePath}/${newItemPath}${currentFolder ? `?folderId=${encodeURIComponent(currentFolder.id)}` : ""}`;
  const createItemAction = (
    <Link href={newItemHref} className="btn btn-primary">
      <Plus size={16} aria-hidden="true" />
      {newItemLabel}
    </Link>
  );

  return (
    <div className="folder-explorer">
      <aside className="explorer-index" aria-label="Índice de pastas">
        <p className="eyebrow">Organização do acervo</p>
        <h2>Índice de pastas</h2>
        <nav aria-label="Pastas da coleção">
          <ul>
            <li>
              <Link
                href={basePath}
                aria-current={!currentFolderId ? "page" : undefined}
                className="explorer-index-link"
              >
                <FolderOpen size={17} aria-hidden="true" />
                <span>{rootLabel}</span>
              </Link>
            </li>
            {indexFolders.map(({ folder, depth }) => (
              <li key={folder.id}>
                <Link
                  href={folderHref(folder.id)}
                  aria-current={
                    folder.id === currentFolderId ? "page" : undefined
                  }
                  className="explorer-index-link"
                  style={{ paddingLeft: `${12 + Math.min(depth, 5) * 12}px` }}
                >
                  {folder.id === currentFolderId ? (
                    <FolderOpen size={16} aria-hidden="true" />
                  ) : (
                    <Folder size={16} aria-hidden="true" />
                  )}
                  <span>{folder.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {folders.length === 0 && (
          <p className="explorer-index-note">
            Ainda sem pastas. Os registros podem ficar na raiz ou ser
            organizados em novas pastas.
          </p>
        )}
      </aside>

      <div className="explorer-main">
        <div className="explorer-mobile-index">
          <label htmlFor={selectId} className="field-label">
            Ir para uma pasta
          </label>
          <select
            id={selectId}
            className="field"
            value={currentFolderId || ""}
            onChange={(event) =>
              router.push(folderHref(event.target.value || null))
            }
          >
            <option value="">{rootLabel}</option>
            {missingFolder && (
              <option value={currentFolderId!} disabled>
                Pasta não encontrada
              </option>
            )}
            {indexFolders.map(({ folder }) => (
              <option value={folder.id} key={folder.id}>
                {ancestorsOf(folder)
                  .map((ancestor) => ancestor.name)
                  .join(" / ")}
              </option>
            ))}
          </select>
        </div>

        <nav className="explorer-breadcrumb" aria-label="Caminho da pasta">
          <ol>
            <li>
              <Link
                href={basePath}
                aria-current={!currentFolderId ? "page" : undefined}
              >
                {rootLabel}
              </Link>
            </li>
            {ancestors.map((ancestor) => (
              <li key={ancestor.id}>
                <ChevronRight size={13} aria-hidden="true" />
                <Link
                  href={folderHref(ancestor.id)}
                  aria-current={
                    ancestor.id === currentFolderId ? "page" : undefined
                  }
                >
                  {ancestor.name}
                </Link>
              </li>
            ))}
            {missingFolder && (
              <li>
                <ChevronRight size={13} aria-hidden="true" />
                <span aria-current="page">Pasta não encontrada</span>
              </li>
            )}
          </ol>
        </nav>

        {missingFolder ? (
          <EmptyState
            icon={FolderOpen}
            title="Esta pasta não está no acervo"
            description="O endereço pode estar desatualizado ou a pasta pode ter sido excluída. Volte à raiz para continuar explorando a coleção."
            action={
              <Link href={basePath} className="btn btn-secondary">
                Voltar à raiz
              </Link>
            }
          />
        ) : (
          <section aria-labelledby={titleId}>
            <header className="explorer-heading">
              <div className="explorer-heading-copy">
                <p className="eyebrow">
                  {currentFolder ? "Pasta do acervo" : "Coleção da campanha"}
                </p>
                <h2 id={titleId}>{currentFolder?.name || rootLabel}</h2>
                {currentFolder?.description && (
                  <p className="explorer-description">
                    {currentFolder.description}
                  </p>
                )}
                <p className="explorer-count">
                  {subfolders.length}{" "}
                  {subfolders.length === 1 ? "pasta" : "pastas"}
                  <span aria-hidden="true"> · </span>
                  {currentItems.length}{" "}
                  {currentItems.length === 1
                    ? itemLabel === "entradas"
                      ? "entrada"
                      : "desenho"
                    : itemLabel}
                </p>
              </div>
              {currentFolder && (
                <Link
                  href={folderHref(parentFolderId)}
                  className="btn btn-ghost explorer-up"
                >
                  <ArrowUp size={16} aria-hidden="true" />
                  Subir uma pasta
                </Link>
              )}
            </header>

            <div className="explorer-actions">
              {createItemAction}
              <Link href={newFolderHref} className="btn btn-secondary">
                <FolderPlus size={16} aria-hidden="true" />
                Nova pasta
              </Link>
              {currentFolder && (
                <DeleteDialog
                  title="Excluir pasta"
                  description={`Deseja excluir a pasta “${currentFolder.name}”? Esta ação também exclui suas subpastas e todos os registros dentro dela e não pode ser desfeita.`}
                  onConfirm={async () => {
                    await onDeleteFolder(currentFolder.id);
                    router.replace(folderHref(parentFolderId));
                  }}
                  triggerLabel="Excluir pasta"
                  triggerClassName="btn-ghost explorer-delete"
                />
              )}
            </div>

            {subfolders.length > 0 && (
              <section className="explorer-subfolders" aria-label="Subpastas">
                <h3 className="eyebrow">Pastas deste nível</h3>
                <div className="explorer-folder-grid">
                  {subfolders.map((folder) => (
                    <Link
                      key={folder.id}
                      href={folderHref(folder.id)}
                      className="explorer-folder-card"
                    >
                      <Folder size={25} strokeWidth={1.3} aria-hidden="true" />
                      <span>
                        <strong>{folder.name}</strong>
                        {folder.description && (
                          <small>{folder.description}</small>
                        )}
                      </span>
                      <ChevronRight size={16} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {currentItems.length > 0 && (
              <section className="explorer-items" aria-label={itemLabel}>
                <h3 className="eyebrow">{itemLabel}</h3>
                {children(currentFolderId)}
              </section>
            )}
            {subfolders.length === 0 && currentItems.length === 0 && (
              <EmptyState
                icon={FolderOpen}
                title={emptyTitle}
                description={emptyDescription}
                action={createItemAction}
              />
            )}
          </section>
        )}
      </div>
    </div>
  );
}
