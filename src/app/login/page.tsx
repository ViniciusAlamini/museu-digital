"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import { KeyRound, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginAction(password);
      if (res.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(res.error || "Erro de autenticação.");
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar logar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 shadow-xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-elevated)] ring-4 ring-[var(--color-border)]">
            <KeyRound className="h-8 w-8 text-[var(--color-accent-purple)]" />
          </div>
          <h1 className="font-fantasy text-3xl font-bold text-[var(--color-text-primary)]">
            Acesso Restrito
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            O Museu está protegido contra edições não autorizadas. Digite a senha da campanha para entrar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Senha de Acesso
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-purple)] transition-colors"
              placeholder="Digite a senha..."
              required
            />
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
            className="w-full rounded-lg bg-[var(--color-accent-purple)] px-4 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-60 transition-colors"
          >
            {loading ? "Verificando..." : "Entrar no Museu"}
          </button>

          <div className="text-center">
            <Link href="/" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
              Voltar para o Início
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
