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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-accent-purple)] to-purple-950 p-8 sm:p-10 mb-12 shadow-2xl border border-purple-500/20">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-fantasy text-4xl font-bold text-white sm:text-5xl drop-shadow-md tracking-wide">
              Acervo de Campanhas
            </h1>
            <p className="mt-3 text-purple-200/90 max-w-xl text-lg font-medium">
              Todas as suas aventuras, heróis e contos épicos reunidos em um só lugar.
            </p>
          </div>
          <Link
            href="/campaigns/new"
            className="group flex items-center gap-2 rounded-xl bg-white/10 px-6 py-4 text-sm font-bold text-white hover:bg-white/20 backdrop-blur-md transition-all border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] shrink-0"
          >
            <div className="rounded-full bg-white/20 p-1 transition-transform group-hover:scale-110 group-hover:rotate-90">
              <Plus className="h-4 w-4" />
            </div>
            NOVA CAMPANHA
          </Link>
        </div>
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 text-white/5 pointer-events-none">
          <Swords className="w-96 h-96 rotate-12" />
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
        
        {/* Sidebar: Activity Feed (Timeline) */}
        <div className="lg:col-span-1 order-1">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-8 border-b border-[var(--color-border)] pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-purple)]/10 text-[var(--color-accent-purple)]">
                <Activity className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                Últimos Registros
              </h2>
            </div>
            
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <FileText className="h-10 w-10 text-[var(--color-text-muted)] mb-3 opacity-50" />
                <p className="text-sm font-medium text-[var(--color-text-muted)]">
                  O silêncio ecoa pela guilda.
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Nenhuma atividade recente.
                </p>
              </div>
            ) : (
              <div className="relative border-l-2 border-[var(--color-border)] ml-4 space-y-8 pb-4">
                {recentActivity.map((log) => (
                  <div key={log.id} className="relative pl-6 group">
                    {/* Timeline dot */}
                    <div className="absolute -left-[17px] top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-bg-card)] border-2 border-[var(--color-border)] text-[var(--color-text-muted)] group-hover:border-[var(--color-accent-purple)] group-hover:text-[var(--color-accent-purple)] transition-colors shadow-sm z-10">
                      {log.action === "CRIOU" ? getIconForEntity(log.entityType) : <Edit className="h-4 w-4" />}
                    </div>
                    
                    {/* Content Card */}
                    <div className="flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-[var(--color-accent-purple)]/30">
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                        <span className="font-bold text-[var(--color-accent-purple)]">{log.user}</span>{" "}
                        {log.action === "CRIOU" ? "adicionou" : "editou"} {log.entityType.toLowerCase()}{" "}
                        <span className="font-semibold text-[var(--color-text-primary)]">{log.entityName}</span>
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-border)]/50">
                        <span className="text-xs font-medium text-[var(--color-text-muted)] truncate pr-2">
                          {log.campaign.name}
                        </span>
                        <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider shrink-0 bg-[var(--color-bg-card)] px-2 py-1 rounded-md">
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

        {/* Main Content: Campaigns */}
        <div className="lg:col-span-2 space-y-6 order-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
              <Swords className="h-5 w-5 text-[var(--color-text-primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Suas Campanhas
            </h2>
          </div>
          
          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-card)]/50 py-24 text-center transition-colors hover:border-[var(--color-accent-purple)]/30">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-bg-elevated)] shadow-inner">
                <Swords className="h-10 w-10 text-[var(--color-text-muted)]" />
              </div>
              <div>
                <p className="font-fantasy text-2xl font-bold text-[var(--color-text-primary)]">
                  O Salão está Vazio
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  Crie sua primeira campanha para preencher este espaço.
                </p>
              </div>
              <Link
                href="/campaigns/new"
                className="flex items-center gap-2 rounded-xl bg-[var(--color-accent-purple)] px-6 py-3 text-sm font-bold text-white hover:bg-purple-700 transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                <Plus className="h-5 w-5" />
                Criar Primeira Campanha
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
