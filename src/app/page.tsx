import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CampaignCard } from "@/components/campaign/CampaignCard";
import { Plus, Swords, Activity, Image as ImageIcon, Users, User, FileText, Shield, Edit } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

export const revalidate = 0;

function getIconForEntity(entityType: string) {
  const type = entityType.toLowerCase();
  if (type.includes("arte")) return <ImageIcon className="h-4 w-4" />;
  if (type.includes("npc")) return <Users className="h-4 w-4" />;
  if (type.includes("personagem")) return <User className="h-4 w-4" />;
  if (type.includes("diário")) return <FileText className="h-4 w-4" />;
  if (type.includes("sessão")) return <Swords className="h-4 w-4" />;
  return <Shield className="h-4 w-4" />;
}

export default async function HomePage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          characters: true,
          npcs: true,
          artworks: true,
          sessions: true,
        },
      },
    },
  });

  const recentActivity = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 15,
    include: { campaign: { select: { name: true } } },
    where: {
      action: { in: ["CRIOU", "EDITOU"] }
    }
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-12">
        <div>
          <h1 className="font-fantasy text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl">
            Acervo de Campanhas
          </h1>
          <p className="mt-3 text-[var(--color-text-secondary)] max-w-xl">
            Todas as suas aventuras, personagens e histórias em um só lugar.
          </p>
        </div>
        <Link
          href="/campaigns/new"
          className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-purple)] px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition-colors shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Criar Campanha
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        
        {/* Sidebar: Activity Feed (Now on the left/first) */}
        <div className="lg:col-span-1 order-1">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-6 border-b border-[var(--color-border)] pb-4">
              <Activity className="h-5 w-5 text-[var(--color-accent-purple)]" />
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                Atividades Recentes
              </h2>
            </div>
            
            {recentActivity.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
                Nenhuma atividade recente registrada.
              </p>
            ) : (
              <div className="space-y-6">
                {recentActivity.map((log) => (
                  <div key={log.id} className="flex gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-elevated)] text-[var(--color-accent-purple)] ring-1 ring-[var(--color-border)]">
                      {log.action === "CRIOU" ? getIconForEntity(log.entityType) : <Edit className="h-4 w-4" />}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        <span className="font-semibold text-[var(--color-text-primary)]">{log.user}</span>{" "}
                        {log.action === "CRIOU" ? "adicionou" : "editou"} {log.entityType.toLowerCase()}{" "}
                        <span className="font-medium text-[var(--color-text-primary)]">{log.entityName}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[var(--color-text-muted)]">
                          em {log.campaign.name}
                        </span>
                        <span className="text-[10px] text-[var(--color-border)]">•</span>
                        <span className="text-xs text-[var(--color-text-muted)]">
                          {formatTimeAgo(log.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content: Campaigns (Now on the right/second) */}
        <div className="lg:col-span-2 space-y-6 order-2">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <Swords className="h-5 w-5 text-[var(--color-accent-purple)]" />
            Suas Campanhas
          </h2>
          
          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-6 rounded-xl border border-dashed border-[var(--color-border)] py-24 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-bg-elevated)]">
                <Swords className="h-10 w-10 text-[var(--color-text-muted)]" />
              </div>
              <div>
                <p className="font-fantasy text-xl font-semibold text-[var(--color-text-secondary)]">
                  Nenhuma campanha ainda
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  Crie sua primeira campanha para começar o acervo.
                </p>
              </div>
              <Link
                href="/campaigns/new"
                className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-purple)] px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Criar Campanha
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
