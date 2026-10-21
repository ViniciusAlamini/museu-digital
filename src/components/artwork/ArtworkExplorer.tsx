"use client";

import type { ArtworkFolder, Artwork } from "@/types";
import { deleteArtworkFolder } from "@/app/actions/artworkFolders";
import { FolderExplorer } from "@/components/shared/FolderExplorer";
import { ArtworkCard } from "./ArtworkCard";

interface ArtworkExplorerProps {
  campaignId: string;
  folders: ArtworkFolder[];
  artworks: Artwork[];
}

export function ArtworkExplorer({
  campaignId,
  folders,
  artworks,
}: ArtworkExplorerProps) {
  return (
    <FolderExplorer
      basePath={`/campaigns/${campaignId}/artworks`}
      folderParam="folder"
      folders={folders}
      items={artworks}
      rootLabel="Raiz dos desenhos"
      itemLabel="desenhos"
      newItemPath="new"
      newItemLabel="Adicionar desenho"
      emptyTitle="Uma nova parte da coleção"
      emptyDescription="Adicione um desenho da campanha ou crie uma pasta para reunir as obras desta coleção."
      onDeleteFolder={(folderId) => deleteArtworkFolder(folderId, campaignId)}
    >
      {(folderId) => (
        <div className="explorer-artworks">
          {artworks
            .filter((artwork) => (artwork.folderId || null) === folderId)
            .map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                campaignId={campaignId}
              />
            ))}
        </div>
      )}
    </FolderExplorer>
  );
}
