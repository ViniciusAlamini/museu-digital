import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate, formatDateShort } from "@/lib/utils";
import { deleteCampaign } from "@/app/actions/campaigns";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import {
  Edit,
  Calendar,
  Users,
  ImageIcon,
  FileText,
  Swords,
  Trash2,
} from "lucide-react";

import { getSessionRole } from "@/lib/auth";

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const role = await getSessionRole();

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      _count: {
        select: { characters: true, npcs: true, artworks: true, sessions: true },
      },
    },
  });

  if (!campaign) notFound();

  const stats = [
    {
      label: "Personagens",
      value: campaign._count.characters,
      icon: Users,
      href: `/campaigns/${id}/characters`,
    },
    {
      label: "NPCs",
      value: campaign._count.npcs,
      icon: Users,
      href: `/campaigns/${id}/npcs`,
    },
    {
      label: "Desenhos",
      value: campaign._count.artworks,
      icon: ImageIcon,
      href: `/campaigns/${id}/artworks`,
    },
    {
      label: "Sessões",
      value: campaign._count.sessions,
      icon: FileText,
      href: `/campaigns/${id}/sessions`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Actions */}
      {role === "admin" && (
        <div className="flex justify-end gap-2">
          <Link
            href={`/campaigns/${id}/edit`}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Link>
          <DeleteDialog
            title="Excluir Campanha"
            description={`Tem certeza que deseja excluir "${campaign.name}"? Todos os personagens, desenhos e posts serão excluídos permanentemente.`}
            onConfirm={async () => {
              "use server";
              await deleteCampaign(id);
            }}
            trigger={
              <button className="flex items-center gap-2 rounded-lg border border-red-900/40 px-4 py-2 text-sm text-red-400 hover:border-red-700 hover:bg-red-950/20 transition-colors">
                <Trash2 className="h-4 w-4" />
                Excluir
              </button>
            }
          />
        </div>
      )}

      {/* Description */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Swords className="h-5 w-5 text-[var(--color-accent-gold)]" />
          <h2 className="font-fantasy text-xl font-semibold text-[var(--color-text-primary)]">
            Sobre a Campanha
          </h2>
        </div>
        <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
          {campaign.description}
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <Calendar className="h-4 w-4" />
          <span>Início: {formatDate(campaign.startDate)}</span>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="font-fantasy text-xl font-semibold text-[var(--color-text-primary)] mb-4">
          Acervo
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="group flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 hover:border-[var(--color-accent-purple)]/50 hover:bg-[var(--color-bg-elevated)] transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-purple)]/10">
                <Icon className="h-6 w-6 text-[var(--color-accent-purple)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-gold-light)] transition-colors">
                  {value}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
