"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/app/actions/auth";
import { UserPlus, ShieldAlert, User } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invitePassword, setInvitePassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await registerAction(username, password, invitePassword);
      if (res.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(res.error || "Erro ao registrar.");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 shadow-xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-elevated)] ring-4 ring-[var(--color-border)]">
            <UserPlus className="h-8 w-8 text-[var(--color-accent-gold-light)]" />
          </div>
          <h1 className="font-fantasy text-3xl font-bold text-[var(--color-text-primary)]">
            Novo Aventureiro
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Crie seu usuário para poder adicionar conteúdos ao museu e registrar seu nome nas artes e personagens.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Nome de Usuário
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--color-text-muted)]">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-3 pl-10 pr-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent-gold-light)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-gold-light)] transition-colors"
                placeholder="Ex: Lucas"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Senha Simples
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent-gold-light)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-gold-light)] transition-colors"
              placeholder="Pelo menos 3 caracteres..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Senha de Convite
            </label>
            <input
              type="password"
              value={invitePassword}
              onChange={(e) => setInvitePassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent-gold-light)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-gold-light)] transition-colors"
              placeholder="Senha secreta da mesa..."
              required
            />
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">Peça ao Mestre a senha para poder se cadastrar.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-950/30 p-3 text-sm text-red-400 border border-red-900/50">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--color-accent-gold-light)] px-4 py-3 font-semibold text-black hover:bg-[var(--color-accent-gold)] disabled:opacity-60 transition-colors"
          >
            {loading ? "Registrando..." : "Criar Personagem (Conta)"}
          </button>

          <div className="mt-6 border-t border-[var(--color-border)] pt-6 text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Já tem uma conta?{" "}
              <Link href="/login" className="font-semibold text-[var(--color-accent-purple)] hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
