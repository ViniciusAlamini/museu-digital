"use client";

import { useId, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Trash2 } from "lucide-react";

interface DeleteDialogProps {
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
  triggerLabel?: string;
  triggerClassName?: string;
}

export function DeleteDialog({
  title,
  description,
  onConfirm,
  triggerLabel = "Excluir",
  triggerClassName = "btn-danger",
}: DeleteDialogProps) {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const pending = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function open(event: MouseEvent<HTMLButtonElement>) {
    openerRef.current = event.currentTarget;
    setError("");
    dialogRef.current?.showModal();
  }

  async function confirm() {
    if (pending.current) return;
    pending.current = true;
    setLoading(true);
    setError("");
    try {
      await onConfirm();
      dialogRef.current?.close();
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "digest" in error &&
        typeof error.digest === "string" &&
        error.digest.startsWith("NEXT_REDIRECT")
      )
        throw error;
      setError("Não foi possível excluir este registro. Tente novamente.");
    } finally {
      pending.current = false;
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`btn delete-trigger ${triggerClassName}`}
        aria-label={title}
        aria-haspopup="dialog"
        aria-controls={id}
        onClick={open}
      >
        <Trash2 size={16} aria-hidden="true" />
        {triggerLabel}
      </button>
      <dialog
        ref={dialogRef}
        id={id}
        className="delete-dialog"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        onCancel={(event) => {
          if (pending.current) event.preventDefault();
        }}
        onClose={() => openerRef.current?.focus()}
      >
        <p className="eyebrow">Remover do acervo</p>
        <h2 id={`${id}-title`}>{title}</h2>
        <p id={`${id}-description`} className="delete-dialog-description">
          {description}
        </p>
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <p className="form-help" role="status">
          {loading
            ? "Excluindo o registro…"
            : "Esta ação não pode ser desfeita."}
        </p>
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            autoFocus
            disabled={loading}
            onClick={() => dialogRef.current?.close()}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-danger"
            disabled={loading}
            onClick={() => void confirm()}
          >
            <Trash2 size={16} aria-hidden="true" />
            {loading ? "Excluindo…" : "Excluir"}
          </button>
        </div>
      </dialog>
    </>
  );
}
