import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-symbol">
        <Icon strokeWidth={1.2} aria-hidden="true" />
      </div>
      <p className="eyebrow">Uma folha em branco</p>
      <h2>{title}</h2>
      <p>{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
