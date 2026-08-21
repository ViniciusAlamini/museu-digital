import Link from "next/link";
import { Swords } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-bg-elevated)]">
        <Swords className="h-12 w-12 text-[var(--color-text-muted)]" />
      </div>
      <div>
        <h1 className="font-fantasy text-5xl font-bold text-[var(--color-text-primary)] mb-2">
          404
        </h1>
        <p className="font-fantasy text-xl text-[var(--color-text-secondary)] mb-1">
          Página não encontrada
        </p>
        <p className="text-sm text-[var(--color-text-muted)]">
          Esta aventura não existe no acervo.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-lg bg-[var(--color-accent-purple)] px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
      >
        Voltar ao Início
      </Link>
    </div>
  );
}
