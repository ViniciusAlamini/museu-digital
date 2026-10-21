import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { DeleteDialog } from "./DeleteDialog";
export function RecordActions({
  backHref,
  backLabel,
  editHref,
  onDelete,
  deleteTitle,
  deleteDescription,
}: {
  backHref: string;
  backLabel: string;
  editHref: string;
  onDelete: () => Promise<void>;
  deleteTitle: string;
  deleteDescription: string;
}) {
  return (
    <div className="detail-actions">
      <Link href={backHref} className="btn btn-ghost">
        <ArrowLeft />
        {backLabel}
      </Link>
      <div>
        <Link href={editHref} className="btn btn-secondary">
          <Pencil />
          Editar
        </Link>
        <DeleteDialog
          title={deleteTitle}
          description={deleteDescription}
          onConfirm={onDelete}
        />
      </div>
    </div>
  );
}
