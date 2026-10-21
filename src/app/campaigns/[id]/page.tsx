import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Users,
  ImageIcon,
  FileText,
  MessageSquare,
  Feather,
  ArrowUpRight,
} from "lucide-react";
import { deleteCampaign } from "@/app/actions/campaigns";
import { RecordActions } from "@/components/shared/RecordActions";
import { formatDateShort } from "@/lib/utils";
export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          characters: true,
          artworks: true,
          posts: true,
          messages: true,
          entries: true,
        },
      },
      entries: { take: 3, orderBy: { date: "desc" } },
    },
  });
  if (!campaign) notFound();
  const base = `/campaigns/${id}`;
  const index = [
    {
      title: "Personagens",
      description: "Os nomes que fazem a história",
      count: campaign._count.characters,
      href: "/characters",
      icon: Users,
    },
    {
      title: "Desenhos & mapas",
      description: "O que a imaginação tornou visível",
      count: campaign._count.artworks,
      href: "/artworks",
      icon: ImageIcon,
    },
    {
      title: "Posts & histórias",
      description: "Acontecimentos dignos de registro",
      count: campaign._count.posts,
      href: "/posts",
      icon: FileText,
    },
    {
      title: "Correspondências",
      description: "Palavras que cruzaram os caminhos",
      count: campaign._count.messages,
      href: "/messages",
      icon: MessageSquare,
    },
    {
      title: "Diário de viagem",
      description: "As memórias de cada jornada",
      count: campaign._count.entries,
      href: "/diary",
      icon: Feather,
    },
  ];
  return (
    <div className="campaign-overview">
      <section className="paper campaign-synopsis" aria-labelledby="campaign-synopsis-title">
        <h2 className="eyebrow mb-4" id="campaign-synopsis-title">O início da história</h2>
        <p className="overview-intro">{campaign.description}</p>
      </section>
      <section className="campaign-index-section" id="indice-da-aventura" aria-labelledby="campaign-index-title">
        <div className="section-title">
          <h2 id="campaign-index-title">As páginas desta aventura</h2>
          <span className="eyebrow">Índice do volume</span>
        </div>
        <div className="overview-index">
          {index.map(({ title, description, count, href, icon: Icon }) => (
            <Link key={href} href={base + href}>
              <span className="index-icon">
                <Icon />
              </span>
              <div className="index-copy">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <span className="index-count">
                {String(count).padStart(2, "0")}
              </span>
              <ArrowUpRight size={16} className="text-[var(--brass)]" />
            </Link>
          ))}
        </div>
      </section>
      {campaign.entries.length > 0 && (
        <section className="mt-12">
          <div className="section-title">
            <h2>Últimas páginas escritas</h2>
            <Link href={base + "/diary"}>
              Abrir o diário <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="recent-records">
            {campaign.entries.map((entry) => (
              <Link
                key={entry.id}
                href={base + "/diary/" + entry.id}
                className="recent-record"
              >
                <span className="folio-number">
                  {formatDateShort(entry.date)}
                </span>
                <div>
                  <h3>{entry.title}</h3>
                  <p>Por {entry.author}</p>
                </div>
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </section>
      )}
      <details className="campaign-management">
        <summary>Gerenciar campanha</summary>
        <p>Altere os dados deste volume ou exclua a campanha e seus registros.</p>
        <RecordActions
          backHref="/"
          backLabel="Voltar à biblioteca"
          editHref={base + "/edit"}
          deleteTitle="Excluir campanha"
          deleteDescription={`Excluir “${campaign.name}” também remove seus personagens, desenhos, mensagens e registros. Essa ação não pode ser desfeita.`}
          onDelete={async () => {
            "use server";
            await deleteCampaign(id);
          }}
        />
      </details>
    </div>
  );
}
