import Image from "next/image";
import Link from "next/link";
import { Message } from "@/types";
import { formatDate } from "@/lib/utils";
import { User, Calendar, MessageCircle } from "lucide-react";

interface MessageCardProps {
  message: Message & { character?: { name: string; image: string | null } | null };
  campaignId: string;
}

const typeColors: Record<string, string> = {
  "Mensagem pessoal": "bg-blue-900/30 text-blue-400 border-blue-900/50",
  "Pensamento do personagem": "bg-purple-900/30 text-purple-400 border-purple-900/50",
  "Mensagem para outro personagem": "bg-green-900/30 text-green-400 border-green-900/50",
  "Mensagem para o grupo": "bg-amber-900/30 text-amber-400 border-amber-900/50",
  "Registro de um momento": "bg-rose-900/30 text-rose-400 border-rose-900/50",
};

export function MessageCard({ message, campaignId }: MessageCardProps) {
  const badgeClass = typeColors[message.type] || "bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border-[var(--color-border)]";

  return (
    <div className="group relative block rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 transition-all hover:border-[var(--color-border-hover)]">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {message.character?.image ? (
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[var(--color-border)]">
              <Image src={message.character.image} alt={message.character.name} fill className="object-cover" />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg-elevated)]">
              <User className="h-5 w-5 text-[var(--color-text-muted)]" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-fantasy font-semibold text-[var(--color-text-primary)]">
                {message.character ? message.character.name : message.author}
              </span>
              {message.character && (
                <span className="text-xs text-[var(--color-text-muted)]">por {message.author}</span>
              )}
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">
              {formatDate(message.createdAt)}
            </div>
          </div>
        </div>
        
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}>
          {message.type}
        </span>
      </div>

      {message.title && (
        <h3 className="mb-2 font-fantasy text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-gold-light)] transition-colors">
          {message.title}
        </h3>
      )}

      <div className="mb-4 text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap leading-relaxed">
        {message.content}
      </div>

      {message.image && (
        <div className="relative mb-4 mt-2 h-64 w-full overflow-hidden rounded-lg border border-[var(--color-border)]">
          <Image src={message.image} alt="Imagem da mensagem" fill className="object-cover" />
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
        {message.eventDate && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <Calendar className="h-3.5 w-3.5" />
            Acontecimento: {formatDate(message.eventDate)}
          </div>
        )}
        
        <div className="flex flex-1 justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Link
            href={`/campaigns/${campaignId}/messages/${message.id}/edit`}
            className="text-xs font-medium text-[var(--color-accent-purple)] hover:text-purple-400"
          >
            Editar
          </Link>
        </div>
      </div>
    </div>
  );
}
