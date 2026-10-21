import Link from "next/link";
import { ArchiveBrand } from "@/components/shared/ArchiveBrand";
import { login } from "@/app/actions/auth";

const errors: Record<string, string> = {
  invalid: "Usuário ou senha incorretos.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  return (
    <section className="auth-card" aria-labelledby="login-title">
      <ArchiveBrand />
      <p className="eyebrow">O acervo das nossas aventuras</p>
      <h1 id="login-title">Entre no museu</h1>
      <p className="auth-copy">Acesse suas campanhas, personagens e memórias.</p>
      {error && <p className="auth-error" role="alert">{errors[error] ?? "Não foi possível entrar."}</p>}
      <form action={login} className="auth-form">
        <input type="hidden" name="next" value={next ?? "/"} />
        <label>Nome de usuário<input className="field" name="username" autoComplete="username" required minLength={3} maxLength={24} /></label>
        <label>Senha<input className="field" type="password" name="password" autoComplete="current-password" required /></label>
        <button className="btn btn-primary" type="submit">Entrar</button>
      </form>
      <p className="auth-switch">Ainda não tem conta? <Link href="/register">Criar cadastro</Link></p>
    </section>
  );
}
