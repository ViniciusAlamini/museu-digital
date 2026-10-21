import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CampaignCollection } from "@/components/campaign/CampaignCollection";

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
        <p className="eyebrow">O grande acervo · RPG & imaginação</p>
        <h1>
          Toda aventura
          <br />
          merece ser <em>lembrada.</em>
        </h1>
        <div className="collection-intro">
          <p>
            Um lugar para guardar os mundos que visitamos,
            <br className="hidden sm:block" /> os heróis que fomos e as
            histórias que ficaram.
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
      <CampaignCollection campaigns={campaigns} />
      <footer className="collection-colophon ornament-rule">
        <span>Que nenhuma boa história se perca pelo caminho.</span>
        <span>Museu Digital · Acervo de campanhas</span>
      </footer>
    </>
  );
}
