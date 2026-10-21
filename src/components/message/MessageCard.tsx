import Link from "next/link";
import { Message } from "@/types";
import { ArchiveImage } from "@/components/shared/ArchiveImage";
import { formatDateShort } from "@/lib/utils";
import { Pencil, User } from "lucide-react";
export function MessageCard({
  message,
  campaignId,
}: {
  message: Message & {
    character?: { name: string; image: string | null } | null;
  };
  campaignId: string;
}) {
  return (
    <article className="message-card">
      <header className="message-card-header">
        <div className="message-author">
          <div className="message-avatar">
            {message.character?.image ? (
              <ArchiveImage
                src={message.character.image}
                alt={message.character.name}
                fill
                variant="portrait"
                className="object-cover"
              />
            ) : (
              <User size={20} strokeWidth={1.2} />
            )}
          </div>
          <div>
            <strong>{message.character?.name || message.author}</strong>
            <small>
              {message.character ? `Por ${message.author} · ` : ""}
              {formatDateShort(message.createdAt)}
            </small>
          </div>
        </div>
        <span className="catalog-tag">{message.type}</span>
      </header>
      {message.title && <h2>{message.title}</h2>}
      <div className="message-content">{message.content}</div>
      {message.image && (
        <div className="post-card-image mt-6">
          <ArchiveImage
            src={message.image}
            alt={message.title || "Ilustração da mensagem"}
            fill
            className="object-cover"
          />
        </div>
      )}
      <footer className="message-card-footer">
        <span className="text-[11px] text-[var(--ink-muted)]">
          {message.eventDate
            ? `Acontecimento em ${formatDateShort(message.eventDate)}`
            : "Correspondência do acervo"}
        </span>
        <Link
          href={`/campaigns/${campaignId}/messages/${message.id}/edit`}
          className="btn btn-ghost"
        >
          <Pencil />
          Editar mensagem
        </Link>
      </footer>
    </article>
  );
}
