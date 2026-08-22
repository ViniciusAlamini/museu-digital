"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Folder, FolderOpen, Plus, Trash2 } from "lucide-react";
import { ArtworkFolder, Artwork } from "@/types";
import { deleteArtworkFolder } from "@/app/actions/artworkFolders";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { ArtworkCard } from "./ArtworkCard";

interface ArtworkExplorerProps {
  campaignId: string;
  folders: ArtworkFolder[];
  artworks: Artwork[];
}

export function ArtworkExplorer({ campaignId, folders, artworks }: ArtworkExplorerProps) {
  const searchParams = useSearchParams();
  const currentFolderId = searchParams.get("folder") || null;

  const currentFolder = folders.find(f => f.id === currentFolderId);
  const currentSubfolders = folders.filter(f => (f.parentFolderId || null) === currentFolderId);
  const currentArtworks = artworks.filter(a => (a.folderId || null) === currentFolderId);

  // Helper to build tree recursively
  const renderTree = (parentId: string | null, depth = 0) => {
    const children = folders.filter(f => (f.parentFolderId || null) === parentId);
    if (!children.length) return null;

    return (
      <ul className="space-y-1">
        {children.map(folder => {
          const isActive = currentFolderId === folder.id;
          return (
            <li key={folder.id}>
              <Link
                href={`/campaigns/${campaignId}/artworks?folder=${folder.id}`}
                className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${
                  isActive 
                    ? "bg-[var(--color-accent-purple)]/20 text-[var(--color-accent-purple)]" 
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
                }`}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
              >
                {isActive ? <FolderOpen className="h-4 w-4 shrink-0" /> : <Folder className="h-4 w-4 shrink-0" />}
                <span className="truncate">{folder.name}</span>
              </Link>
              {renderTree(folder.id, depth + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="flex h-[750px] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden">
      
      {/* Sidebar - Folder Tree */}
      <div className="w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-elevated)]/50 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <span className="font-fantasy font-semibold text-[var(--color-text-primary)]">Pastas</span>
          <Link
            href={`/campaigns/${campaignId}/artworks/new-folder${currentFolderId ? `?parentId=${currentFolderId}` : ""}`}
            className="p-1 rounded text-[var(--color-text-muted)] hover:text-[var(--color-accent-purple)] transition-colors"
            title="Nova Pasta"
          >
            <Plus className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <Link
            href={`/campaigns/${campaignId}/artworks`}
            className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm font-medium mb-2 transition-colors ${
              !currentFolderId 
                ? "bg-[var(--color-accent-purple)]/20 text-[var(--color-accent-purple)]" 
                : "text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]"
            }`}
          >
            {!currentFolderId ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
            Raiz de Desenhos
          </Link>
          {renderTree(null)}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-card)]">
        {/* Breadcrumb */}
        <div className="h-14 border-b border-[var(--color-border)] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] truncate">
            {currentFolder ? currentFolder.name : "Raiz de Desenhos"}
          </div>
          <div className="flex items-center gap-2">
            {/* Botão de Nova Pasta visível apenas no mobile (já que no PC fica na barra lateral) */}
            <Link
              href={`/campaigns/${campaignId}/artworks/new-folder${currentFolderId ? `?parentId=${currentFolderId}` : ""}`}
              className="flex items-center gap-1.5 rounded border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-border-hover)] transition-colors md:hidden"
            >
              <Plus className="h-3.5 w-3.5" /> Pasta
            </Link>

            <Link
              href={`/campaigns/${campaignId}/artworks/new${currentFolderId ? `?folderId=${currentFolderId}` : ""}`}
              className="flex items-center gap-1.5 rounded bg-[var(--color-accent-purple)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Imagem
            </Link>
            
            {currentFolder && (
              <DeleteDialog
                title="Excluir Pasta"
                description={`Tem certeza que deseja excluir a pasta "${currentFolder.name}" e TODAS as imagens nela?`}
                onConfirm={async () => {
                  await deleteArtworkFolder(currentFolder.id, campaignId);
                }}
                trigger={
                  <button className="p-1.5 rounded border border-red-900/40 text-red-400 hover:bg-red-950/20 transition-colors" title="Excluir Pasta">
                    <Trash2 className="h-4 w-4" />
                  </button>
                }
              />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {(currentSubfolders.length === 0 && currentArtworks.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-[var(--color-text-muted)] space-y-2">
              <FolderOpen className="h-10 w-10 opacity-20" />
              <p className="text-sm">Esta pasta está vazia</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Folders first */}
              {currentSubfolders.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {currentSubfolders.map(folder => (
                    <Link
                      key={folder.id}
                      href={`/campaigns/${campaignId}/artworks?folder=${folder.id}`}
                      className="group flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 hover:border-[var(--color-accent-purple)] transition-colors"
                    >
                      <Folder className="h-8 w-8 text-[var(--color-accent-gold-dark)]" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-gold-light)] transition-colors">
                          {folder.name}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Separator if both folders and artworks exist */}
              {currentSubfolders.length > 0 && currentArtworks.length > 0 && (
                <div className="h-px bg-[var(--color-border)] w-full" />
              )}

              {/* Artworks next */}
              {currentArtworks.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {currentArtworks.map(artwork => (
                    <ArtworkCard key={artwork.id} artwork={artwork} campaignId={campaignId} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
