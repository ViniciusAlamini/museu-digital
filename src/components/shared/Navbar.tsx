import Link from "next/link";
import { Swords, Shield } from "lucide-react";
import { AuthButton } from "./AuthButton";
import { getSession } from "@/lib/auth";

export async function Navbar() {
  const session = await getSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Swords
              className="h-6 w-6 text-[var(--color-accent-gold)] group-hover:text-[var(--color-accent-gold-light)] transition-colors"
              strokeWidth={1.5}
            />
            <span className="font-fantasy text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-gold-light)] transition-colors">
              Museu Digital
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Campanhas
            </Link>
            {session.role === "admin" && (
              <>
                <div className="h-4 w-px bg-[var(--color-border)]" />
                <Link
                  href="/audit"
                  className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
                  title="Painel de Auditoria"
                >
                  <Shield className="h-4 w-4" />
                  Auditoria
                </Link>
              </>
            )}
            <div className="h-4 w-px bg-[var(--color-border)] mx-1" />
            <AuthButton session={session} />
          </div>
        </div>
      </div>
    </nav>
  );
}
