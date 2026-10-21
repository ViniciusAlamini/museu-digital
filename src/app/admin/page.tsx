import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { changeUserRole } from "@/app/actions/admin";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") redirect("/");
  const { error } = await searchParams;
  const [users, events] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "asc" }, select: { id: true, username: true, role: true, createdAt: true } }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { campaign: { select: { name: true } } },
    }),
  ]);
  return (
    <>
      <PageHeader eyebrow="Administração do acervo" title="Pessoas & registros" description="Contas da mesa e histórico das alterações feitas nas campanhas." />
      {error && <p className="auth-error" role="alert">{error === "last-admin" ? "O acervo precisa manter pelo menos um administrador." : "Você não pode remover a própria permissão de administrador."}</p>}
      <section className="admin-section">
        <h2>Contas <span>{users.length}</span></h2>
        <div className="admin-table-wrap"><table className="admin-table">
          <thead><tr><th>Usuário</th><th>Tipo de acesso</th><th>Cadastro</th><th>Ação</th></tr></thead>
          <tbody>{users.map((account) => <tr key={account.id}>
            <td>{account.username}{account.id === user.id ? " (você)" : ""}</td>
            <td>{account.role === "ADMIN" ? "Administrador" : "Membro"}</td>
            <td>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(account.createdAt)}</td>
            <td><form action={changeUserRole} className="role-form"><input type="hidden" name="userId" value={account.id} /><input type="hidden" name="role" value={account.role === "ADMIN" ? "MEMBER" : "ADMIN"} /><button className="btn btn-secondary" type="submit">{account.role === "ADMIN" ? "Tornar membro" : "Tornar admin"}</button></form></td>
          </tr>)}</tbody>
        </table></div>
      </section>
      <section className="admin-section">
        <h2>Auditoria <span>{events.length === 100 ? "100+" : events.length}</span></h2>
        {events.length === 0 ? <p className="admin-empty">Nenhuma alteração registrada.</p> : <ol className="audit-list">{events.map((event) => <li key={event.id}>
          <div><strong>{event.user}</strong> {event.action} <strong>{event.entityType.toLocaleLowerCase("pt-BR")}</strong> “{event.entityName}”</div>
          <p>{event.campaign.name} <time dateTime={event.createdAt.toISOString()}>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(event.createdAt)}</time></p>
        </li>)}</ol>}
      </section>
    </>
  );
}
