import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSessionRole } from "@/lib/auth";
import { Plus, FolderPlus, Folder, Users } from "lucide-react";
import Image from "next/image";

export default async function NpcsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ folder?: string }>;
}) {
  const { id } = await params;
  const { folder: currentFolderId } = await searchParams;
  const role = await getSessionRole();

  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) notFound();

  // Buscar pastas
  const folders = await prisma.npcFolder.findMany({
    where: {
      campaignId: id,
      parentFolderId: currentFolderId || null,
    },
    orderBy: { name: "asc" },
  });

  // Buscar NPCs
  const npcs = await prisma.npc.findMany({
    where: {
      campaignId: id,
      folderId: currentFolderId || null,
    },
    orderBy: { name: "asc" },
  });

  // Caminho do pão (breadcrumbs)
  const breadcrumbs = [];
  let curr = currentFolderId;
  while (curr) {
    const f = await prisma.npcFolder.findUnique({ where: { id: curr } });
    if (f) {
      breadcrumbs.unshift({ id: f.id, name: f.name });
      curr = f.parentFolderId || undefined;
    } else {
      break;
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-fantasy text-2xl font-semibold text-[var(--color-text-primary)]">
            NPCs
          </h2>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mt-1 text-sm text-[var(--color-text-muted)]">
            <Link href={`/campaigns/${id}/npcs`} className="hover:text-[var(--color-text-primary)]">
              Raiz
            </Link>
            {breadcrumbs.map((b) => (
              <span key={b.id} className="flex items-center gap-2">
                <span>/</span>
                <Link
                  href={`/campaigns/${id}/npcs?folder=${b.id}`}
                  className="hover:text-[var(--color-text-primary)]"
                >
                  {b.name}
                </Link>
              </span>
            ))}
          </div>
        </div>

        {role !== "visitor" && (
          <div className="flex gap-2">
            <Link
              href={`/campaigns/${id}/npcs/new-folder${currentFolderId ? `?parent=${currentFolderId}` : ""}`}
              className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <FolderPlus className="h-4 w-4" />
              Nova Pasta
            </Link>
            <Link
              href={`/campaigns/${id}/npcs/new${currentFolderId ? `?folder=${currentFolderId}` : ""}`}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-purple)] px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Novo NPC
            </Link>
          </div>
        )}
      </div>

      {folders.length === 0 && npcs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[var(--color-border)] py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-elevated)]">
            <Users className="h-8 w-8 text-[var(--color-text-muted)]" />
          </div>
          <div>
            <p className="font-fantasy text-lg font-semibold text-[var(--color-text-secondary)]">
              Nenhum NPC aqui
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Crie pastas ou adicione novos NPCs.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Pastas */}
          {folders.map((folder) => (
            <Link
              key={folder.id}
              href={`/campaigns/${id}/npcs?folder=${folder.id}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 text-center hover:border-[var(--color-accent-purple)]/50 hover:bg-[var(--color-bg-elevated)] transition-all"
            >
              <Folder className="h-12 w-12 text-[var(--color-accent-purple)]/70 group-hover:text-[var(--color-accent-purple)] transition-colors" />
              <div>
                <p className="font-medium text-[var(--color-text-primary)] line-clamp-1">
                  {folder.name}
                </p>
                {folder.description && (
                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-1 mt-0.5">
                    {folder.description}
                  </p>
                )}
              </div>
            </Link>
          ))}

          {/* NPCs */}
          {npcs.map((npc) => (
            <Link
              key={npc.id}
              href={`/campaigns/${id}/npcs/${npc.id}`}
              className="group flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden hover:border-[var(--color-accent-purple)]/50 hover:shadow-lg hover:shadow-purple-950/20 transition-all duration-300"
            >
              <div className="relative aspect-square w-full bg-[var(--color-bg-elevated)]">
                {npc.image ? (
                  <Image
                    src={npc.image}
                    alt={npc.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="h-10 w-10 text-[var(--color-text-muted)]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-[var(--color-bg-card)]/20 to-transparent opacity-80" />
                <div className="absolute bottom-0 w-full p-3">
                  <p className="font-fantasy font-semibold text-[var(--color-text-primary)] truncate drop-shadow-md">
                    {npc.name}
                  </p>
                  {npc.occupation && (
                    <p className="text-xs text-[var(--color-accent-gold-light)] truncate drop-shadow-md">
                      {npc.occupation}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
