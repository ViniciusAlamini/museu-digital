import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Shield, Plus, Edit, Trash2 } from "lucide-react";

export default async function AuditPage() {
  // Somente admins podem acessar
  await requireAuth("admin");

  // Buscar logs mais recentes
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    include: { campaign: { select: { name: true } } },
    take: 200, // Limite para não sobrecarregar
  });

  // Estatísticas de ações
  const stats = {
    CRIOU: logs.filter((l) => l.action === "CRIOU").length,
    EDITOU: logs.filter((l) => l.action === "EDITOU").length,
    EXCLUIU: logs.filter((l) => l.action === "EXCLUIU").length,
  };

  const getActionIcon = (action: string) => {
    if (action === "CRIOU") return <Plus className="h-4 w-4" />;
    if (action === "EDITOU") return <Edit className="h-4 w-4" />;
    if (action === "EXCLUIU") return <Trash2 className="h-4 w-4" />;
    return null;
  };

  const getActionColor = (action: string) => {
    if (action === "CRIOU") return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (action === "EDITOU") return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    if (action === "EXCLUIU") return "text-red-400 bg-red-400/10 border-red-400/20";
    return "text-gray-400 bg-gray-400/10 border-gray-400/20";
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8 py-8">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-purple)]/10 ring-1 ring-[var(--color-accent-purple)]/20">
          <Shield className="h-6 w-6 text-[var(--color-accent-purple)]" />
        </div>
        <div>
          <h1 className="font-fantasy text-3xl font-bold text-[var(--color-text-primary)]">
            Auditoria Global
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Registro detalhado de todas as atividades no sistema.
          </p>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
          <p className="text-sm font-medium text-[var(--color-text-muted)]">Criações</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">{stats.CRIOU}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
          <p className="text-sm font-medium text-[var(--color-text-muted)]">Edições</p>
          <p className="mt-2 text-3xl font-bold text-blue-400">{stats.EDITOU}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
          <p className="text-sm font-medium text-[var(--color-text-muted)]">Exclusões</p>
          <p className="mt-2 text-3xl font-bold text-red-400">{stats.EXCLUIU}</p>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--color-text-secondary)]">
            <thead className="bg-[var(--color-bg-elevated)] text-xs uppercase text-[var(--color-text-muted)]">
              <tr>
                <th className="px-6 py-4 font-semibold">Data / Hora</th>
                <th className="px-6 py-4 font-semibold">Usuário</th>
                <th className="px-6 py-4 font-semibold">Ação</th>
                <th className="px-6 py-4 font-semibold">Entidade</th>
                <th className="px-6 py-4 font-semibold">Detalhes</th>
                <th className="px-6 py-4 font-semibold">Campanha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[var(--color-text-muted)]">
                    Nenhum log registrado ainda.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--color-bg-elevated)] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-[var(--color-text-primary)]">
                          {formatDate(log.createdAt)}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)]">
                          {format(log.createdAt, "HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-[var(--color-accent-gold-light)]">
                        {log.user}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getActionColor(log.action)}`}>
                        {getActionIcon(log.action)}
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[var(--color-text-primary)] font-medium">
                        {log.entityType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[var(--color-text-primary)] font-medium">
                        {log.entityName}
                      </span>
                      {log.details && (
                        <p className="text-xs mt-1 text-[var(--color-text-muted)]">
                          {log.details}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-[var(--color-text-muted)]">
                      {log.campaign.name}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
