import Link from "next/link";
import { ArrowUpRight, BookOpen, Feather, FileText, Folder, ImageIcon, MessageSquare, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { describeActivity } from "@/lib/activity-feed";

const icons = { artwork: ImageIcon, character: Users, post: FileText, message: MessageSquare, diary: Feather, folder: Folder, campaign: BookOpen };
const formatTime = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo",
});

export async function ActivityFeed() {
  const events = await prisma.auditLog.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 12,
    select: { id: true, campaignId: true, user: true, action: true, entityType: true, entityName: true, details: true, createdAt: true, campaign: { select: { name: true } } },
  });
  const activities = events.map((event) => describeActivity(event));
  function idsFor(kind: (typeof activities)[number]["kind"]) {
    return activities.filter((activity) => activity.kind === kind).flatMap((activity) => {
      const url = new URL(activity.href, "https://library.local");
      const id = kind === "message" ? url.hash.match(/^#message-([\w-]+)$/)?.[1] : url.pathname.split("/")[4];
      return id ? [id] : [];
    });
  }
  const select = { id: true, campaignId: true } as const;
  const [artworks, characters, posts, entries, messages] = await Promise.all([
    prisma.artwork.findMany({ where: { id: { in: idsFor("artwork") } }, select }),
    prisma.character.findMany({ where: { id: { in: idsFor("character") } }, select }),
    prisma.post.findMany({ where: { id: { in: idsFor("post") } }, select }),
    prisma.diaryEntry.findMany({ where: { id: { in: idsFor("diary") } }, select }),
    prisma.message.findMany({ where: { id: { in: idsFor("message") } }, select }),
  ]);
  const existingLinks = new Set([
    ...artworks.map((item) => `/campaigns/${item.campaignId}/artworks/${item.id}`),
    ...characters.map((item) => `/campaigns/${item.campaignId}/characters/${item.id}`),
    ...posts.map((item) => `/campaigns/${item.campaignId}/posts/${item.id}`),
    ...entries.map((item) => `/campaigns/${item.campaignId}/diary/${item.id}`),
    ...messages.map((item) => `/campaigns/${item.campaignId}/messages#message-${item.id}`),
  ]);
  function items(rows: typeof events) {
    return rows.map((event) => {
      const activity = describeActivity(event, existingLinks);
      const Icon = icons[activity.kind];
      return (
        <li key={event.id}>
          <Link href={activity.href} className="activity-item">
            <span className="activity-icon" aria-hidden="true"><Icon size={17} /></span>
            <div className="activity-copy">
              <p className="activity-action"><strong>{event.user.trim()}</strong> {activity.text}</p>
              <p className="activity-title">{event.entityName}</p>
              <span className="activity-campaign">{event.campaign.name}</span>
              <time dateTime={event.createdAt.toISOString()}>{formatTime.format(event.createdAt)}</time>
            </div>
            <ArrowUpRight className="activity-arrow" size={13} aria-hidden="true" />
          </Link>
        </li>
      );
    });
  }
  return (
    <section className="activity-feed" aria-labelledby="activity-feed-title">
      <header className="activity-feed-heading">
        <p className="eyebrow">Todas as campanhas</p>
        <h2 id="activity-feed-title">Últimas atividades</h2>
        <p>Novas páginas, desenhos e histórias da mesa.</p>
      </header>
      {events.length ? (
        <>
          <ol className="activity-list">{items(events.slice(0, 4))}</ol>
          {events.length > 4 && (
            <details className="activity-more">
              <summary>Ver mais atividades <span aria-hidden="true">+</span></summary>
              <ol className="activity-list" start={5}>{items(events.slice(4))}</ol>
            </details>
          )}
        </>
      ) : (
        <div className="activity-empty">
          <Feather size={24} aria-hidden="true" />
          <p>As próximas novidades aparecem aqui.</p>
          <span>Adicione um desenho, personagem ou registro em uma campanha para começar.</span>
        </div>
      )}
    </section>
  );
}
