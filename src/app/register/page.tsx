import Link from "next/link";
import { ArchiveBrand } from "@/components/shared/ArchiveBrand";
import { register } from "@/app/actions/auth";

const errors: Record<string, string> = {
  invite: "Código de convite inválido.",
  username: "Use de 3 a 24 letras, números, ponto, hífen ou sublinhado.",
  password: "A senha precisa ter de 10 a 72 caracteres.",
  confirm: "As senhas não coincidem.",
  exists: "Esse nome de usuário já está em uso.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <section className="auth-card" aria-labelledby="register-title">
      <ArchiveBrand />
      <p className="eyebrow">Uma nova página começa aqui</p>
      <h1 id="register-title">Criar cadastro</h1>
      <p className="auth-copy">Guarde as histórias da sua mesa em um só lugar.</p>
      {error && <p className="auth-error" role="alert">{errors[error] ?? "Não foi possível criar o cadastro."}</p>}
      <form action={register} className="auth-form">
        <label>Código de convite<input className="field" name="inviteCode" autoComplete="off" required /></label>
        <label>Nome de usuário<input className="field" name="username" autoComplete="username" required minLength={3} maxLength={24} /></label>
        <label>Senha<input className="field" type="password" name="password" autoComplete="new-password" required minLength={10} maxLength={72} /><small>Use pelo menos 10 caracteres.</small></label>
        <label>Confirme a senha<input className="field" type="password" name="confirmPassword" autoComplete="new-password" required minLength={10} maxLength={72} /></label>
        <button className="btn btn-primary" type="submit">Criar conta</button>
      </form>
      <p className="auth-switch">Já tem uma conta? <Link href="/login">Entrar</Link></p>
    </section>
  );
}
