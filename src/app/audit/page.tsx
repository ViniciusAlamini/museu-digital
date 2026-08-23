import { prisma } from "@/lib/prisma";
import { getSessionRole } from "@/lib/auth";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import {
  Users,
  ImageIcon,
  BookOpen,
  FileText,
  MessageSquare,
  FolderOpen,
  Edit2,
  Plus,
  Shield,
} from "lucide-react";

export default async function AuditPage() {
  const role = await getSessionRole();

  if (role !== "admin") {
    notFound();
  }

  // Busca tudo que tem addedBy/updatedBy
  const [characters, artworks, diaryEntries, posts, messages, artworkFolders, diaryFolders] =
    await Promise.all([
      prisma.character.findMany({
        where: { OR: [{ addedBy: { not: null } }, { updatedBy: { not: null } }] },
        include: { campaign: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.artwork.findMany({
        where: { OR: [{ addedBy: { not: null } }, { updatedBy: { not: null } }] },
        include: { campaign: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.diaryEntry.findMany({
        where: { OR: [{ addedBy: { not: null } }, { updatedBy: { not: null } }] },
        include: { campaign: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.post.findMany({
        where: { OR: [{ addedBy: { not: null } }, { updatedBy: { not: null } }] },
        include: { campaign: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.message.findMany({
        where: { OR: [{ addedBy: { not: null } }, { updatedBy: { not: null } }] },
        include: { campaign: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.artworkFolder.findMany({
        where: { OR: [{ addedBy: { not: null } }, { updatedBy: { not: null } }] },
        include: { campaign: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.diaryFolder.findMany({
        where: { OR: [{ addedBy: { not: null } }, { updatedBy: { not: null } }] },
        include: { campaign: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  // Monta uma lista unificada de eventos de auditoria
  const events = [
    ...characters.map((c) => ({
      id: c.id,
      type: "Personagem",
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-950/30 border-purple-900/50",
      name: c.name,
      campaign: c.campaign.name,
      addedBy: c.addedBy,
      updatedBy: c.updatedBy,
      date: c.createdAt,
    })),
    ...artworks.map((a) => ({
      id: a.id,
      type: "Arte",
      icon: ImageIcon,
      color: "text-pink-400",
      bg: "bg-pink-950/30 border-pink-900/50",
      name: a.title,
      campaign: a.campaign.name,
      addedBy: a.addedBy,
      updatedBy: a.updatedBy,
      date: a.createdAt,
    })),
    ...diaryEntries.map((d) => ({
      id: d.id,
      type: "Diário",
      icon: BookOpen,
      color: "text-amber-400",
      bg: "bg-amber-950/30 border-amber-900/50",
      name: d.title,
      campaign: d.campaign.name,
      addedBy: d.addedBy,
      updatedBy: d.updatedBy,
      date: d.createdAt,
    })),
    ...posts.map((p) => ({
      id: p.id,
      type: "Post",
      icon: FileText,
      color: "text-blue-400",
      bg: "bg-blue-950/30 border-blue-900/50",
      name: p.title,
      campaign: p.campaign.name,
      addedBy: p.addedBy,
      updatedBy: p.updatedBy,
      date: p.createdAt,
    })),
    ...messages.map((m) => ({
      id: m.id,
      type: "Mensagem",
      icon: MessageSquare,
      color: "text-green-400",
      bg: "bg-green-950/30 border-green-900/50",
      name: m.title || m.content.slice(0, 40) + "...",
      campaign: m.campaign.name,
      addedBy: m.addedBy,
      updatedBy: m.updatedBy,
      date: m.createdAt,
    })),
    ...artworkFolders.map((f) => ({
      id: f.id,
      type: "Pasta de Arte",
      icon: FolderOpen,
      color: "text-orange-400",
      bg: "bg-orange-950/30 border-orange-900/50",
      name: f.name,
      campaign: f.campaign.name,
      addedBy: f.addedBy,
      updatedBy: f.updatedBy,
      date: f.createdAt,
    })),
    ...diaryFolders.map((f) => ({
      id: f.id,
      type: "Pasta de Diário",
      icon: FolderOpen,
      color: "text-yellow-400",
      bg: "bg-yellow-950/30 border-yellow-900/50",
      name: f.name,
      campaign: f.campaign.name,
      addedBy: f.addedBy,
      updatedBy: f.updatedBy,
      date: f.createdAt,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Estatísticas por usuário
  const statsByUser: Record<string, { added: number; updated: number }> = {};
  for (const e of events) {
    if (e.addedBy) {
      if (!statsByUser[e.addedBy]) statsByUser[e.addedBy] = { added: 0, updated: 0 };
      statsByUser[e.addedBy].added++;
    }
    if (e.updatedBy) {
      if (!statsByUser[e.updatedBy]) statsByUser[e.updatedBy] = { added: 0, updated: 0 };
      statsByUser[e.updatedBy].updated++;
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-950/40 ring-2 ring-red-900/50">
          <Shield className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <h1 className="font-fantasy text-2xl font-bold text-[var(--color-text-primary)]">
            Painel de Auditoria
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Visível apenas para o Mestre — rastreia quem criou ou editou cada item.
          </p>
        </div>
      </div>

      {/* Estatísticas por jogador */}
      {Object.keys(statsByUser).length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            Contribuições por Jogador
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(statsByUser).map(([user, stats]) => (
              <div
                key={user}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4"
              >
                <p className="font-semibold text-[var(--color-text-primary)]">@{user}</p>
                <div className="mt-2 flex gap-4 text-xs text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-1">
                    <Plus className="h-3 w-3 text-green-400" />
                    {stats.added} criados
                  </span>
                  <span className="flex items-center gap-1">
                    <Edit2 className="h-3 w-3 text-yellow-400" />
                    {stats.updated} editados
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline de eventos */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Histórico de Atividades ({events.length} registros)
        </h2>

        {events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-border)] py-16 text-center">
            <Shield className="mx-auto h-10 w-10 text-[var(--color-text-muted)] mb-3" />
            <p className="text-[var(--color-text-secondary)]">
              Nenhuma atividade registrada ainda.
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Os registros aparecem aqui assim que os jogadores criarem ou editarem itens.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((event) => {
              const Icon = event.icon;
              return (
                <div
                  key={event.type + event.id}
                  className={`flex items-center gap-4 rounded-lg border p-4 ${event.bg}`}
                >
                  <div className="shrink-0">
                    <Icon className={`h-5 w-5 ${event.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className={`text-xs font-semibold uppercase tracking-wide ${event.color}`}>
                        {event.type}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">·</span>
                      <span className="text-xs text-[var(--color-text-muted)]">{event.campaign}</span>
                    </div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                      {event.name}
                    </p>
                  </div>
                  <div className="shrink-0 text-right space-y-1">
                    {event.addedBy && (
                      <p className="flex items-center gap-1 text-xs text-green-400 justify-end">
                        <Plus className="h-3 w-3" />
                        {event.addedBy}
                      </p>
                    )}
                    {event.updatedBy && (
                      <p className="flex items-center gap-1 text-xs text-yellow-400 justify-end">
                        <Edit2 className="h-3 w-3" />
                        {event.updatedBy}
                      </p>
                    )}
                    <p className="text-[10px] text-[var(--color-text-muted)]">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
