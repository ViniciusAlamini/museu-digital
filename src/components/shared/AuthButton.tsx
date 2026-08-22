"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

import { SessionPayload } from "@/lib/auth";

export function AuthButton({ session }: { session: SessionPayload }) {
  const router = useRouter();

  if (session.role === "visitor") {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-accent-purple)] hover:text-[var(--color-accent-purple)] transition-colors"
      >
        <User className="h-3.5 w-3.5" />
        Entrar / Registrar
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-end">
        <span className="text-xs font-medium text-[var(--color-text-primary)]">
          {session.username}
        </span>
        <span className="text-[10px] text-[var(--color-text-muted)]">
          {session.role === "admin" ? "👑 Mestre" : "⚔️ Jogador"}
        </span>
      </div>
      <button
        onClick={async () => {
          await logoutAction();
          router.push("/");
          router.refresh();
        }}
        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
        title="Sair"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
