"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export function AuthButton({ role }: { role: "visitor" | "player" | "admin" }) {
  const router = useRouter();

  if (role === "visitor") {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-accent-purple)] hover:text-[var(--color-accent-purple)] transition-colors"
      >
        <User className="h-3.5 w-3.5" />
        Fazer Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-[var(--color-text-secondary)]">
        {role === "admin" ? "👑 Mestre" : "⚔️ Jogador"}
      </span>
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
