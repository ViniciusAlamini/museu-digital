import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CampaignCollection } from "@/components/campaign/CampaignCollection";
import { ActivityFeed } from "@/components/shared/ActivityFeed";

export const revalidate = 0;

export default async function HomePage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "asc" },
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
    },
  });
  const characters = campaigns.reduce((n, c) => n + c._count.characters, 0);
  const artworks = campaigns.reduce((n, c) => n + c._count.artworks, 0);
  const records = campaigns.reduce(
    (n, c) => n + c._count.posts + c._count.entries + c._count.messages,
    0,
  );
  return (
    <>
      <header className="collection-heading">
        <p className="eyebrow">Biblioteca de aventuras · RPG & imaginação</p>
        <h1>
          Entre páginas,
          <br />
          vivem <em>outros mundos.</em>
        </h1>
        <div className="collection-intro">
          <p>
            Cada campanha, um livro. Cada mesa, uma história.
            <br className="hidden sm:block" /> Escolha um volume e volte aos mundos que visitamos.
          </p>
          <Link
            href="/campaigns/new"
            className="btn btn-primary self-start sm:self-auto"
          >
            <Plus />
            Nova campanha
          </Link>
        </div>
      </header>
      <div className="collection-stats" aria-label="O acervo em números">
        <span>
          <strong>{String(campaigns.length).padStart(2, "0")}</strong>campanhas
        </span>
        <span>
          <strong>{String(characters).padStart(2, "0")}</strong>personagens
        </span>
        <span>
          <strong>{String(artworks).padStart(2, "0")}</strong>obras & mapas
        </span>
        <span>
          <strong>{String(records).padStart(2, "0")}</strong>registros
        </span>
      </div>
      <div className="library-home-content">
        <div className="library-volumes"><CampaignCollection campaigns={campaigns} /></div>
        <ActivityFeed />
      </div>
      <footer className="collection-colophon ornament-rule">
        <span>Que nenhuma boa história se perca pelo caminho.</span>
        <span>Museu Digital · Acervo de campanhas</span>
      </footer>
    </>
  );
}
