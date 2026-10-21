import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
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
    <div>
      <RecordActions
        backHref="/"
        backLabel="Todas as campanhas"
        editHref={base + "/edit"}
        deleteTitle="Excluir campanha"
        deleteDescription={`Excluir “${campaign.name}” também remove seus personagens, desenhos, mensagens e registros. Essa ação não pode ser desfeita.`}
        onDelete={async () => {
          "use server";
          await deleteCampaign(id);
        }}
      />
      <section className="paper">
        <p className="eyebrow mb-4">O início da história</p>
        <p className="overview-intro">{campaign.description}</p>
      </section>
      <section className="mt-10">
        <div className="section-title">
          <h2>As páginas desta aventura</h2>
          <span className="eyebrow">Índice do volume</span>
        </div>
        <div className="overview-index">
          {index.map(({ title, description, count, href, icon: Icon }) => (
            <Link key={href} href={base + href}>
              <span className="index-icon">
                <Icon />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <span className="index-count">
                {String(count).padStart(2, "0")}
              </span>
              <ArrowUpRight size={16} className="text-[var(--brass)]" />
            </Link>
          ))}
          <Link href={base + "/diary/new-entry"}>
            <span className="index-icon">
              <BookOpen />
            </span>
            <div>
              <h3>Uma nova memória</h3>
              <p>Abra a próxima página do diário</p>
            </div>
            <ArrowUpRight size={18} className="ml-auto text-[var(--brass)]" />
          </Link>
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
    </div>
  );
}
