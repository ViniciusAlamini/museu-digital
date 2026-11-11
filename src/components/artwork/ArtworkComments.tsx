"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { Trash2 } from "lucide-react";
import {
  addArtworkComment,
  deleteArtworkComment,
  type CommentState,
} from "@/app/actions/artworkFeedback";

export type CommentView = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  canDelete: boolean;
};

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

export function ArtworkComments({
  campaignId,
  artworkId,
  comments,
}: {
  campaignId: string;
  artworkId: string;
  comments: CommentView[];
}) {
  const [state, submit, sending] = useActionState<CommentState, FormData>(
    addArtworkComment.bind(null, campaignId, artworkId),
    {},
  );
  const form = useRef<HTMLFormElement>(null);
  const [deleting, startDelete] = useTransition();

  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state.ok]);

  return (
    <section className="artwork-comments" aria-labelledby="comentarios-titulo">
      <h2 id="comentarios-titulo" className="artwork-comments-title">
        Comentários <span>{comments.length}</span>
      </h2>

      {comments.length > 0 ? (
        <ol className="comment-list">
          {comments.map((c) => (
            <li key={c.id} className="comment-item">
              <div className="comment-meta">
                <strong>{c.author}</strong>
                <time dateTime={c.createdAt}>{dateFormat.format(new Date(c.createdAt))}</time>
                {c.canDelete && (
                  <button
                    type="button"
                    className="comment-delete"
                    aria-label={`Apagar comentário de ${c.author}`}
                    disabled={deleting}
                    onClick={() => {
                      if (!confirm("Apagar este comentário?")) return;
                      startDelete(() => deleteArtworkComment(campaignId, artworkId, c.id));
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <p className="comment-content">{c.content}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="comment-empty">Ninguém comentou ainda</p>
      )}

      <form ref={form} action={submit} className="comment-form">
        <label htmlFor="comment-content" className="field-label">
          Seu comentário
        </label>
        <textarea
          id="comment-content"
          name="content"
          className="field"
          rows={3}
          maxLength={1000}
          required
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "comment-error" : undefined}
        />
        {state.error && (
          <p id="comment-error" className="field-error" role="alert">
            {state.error}
          </p>
        )}
        <div className="comment-form-actions">
          <button type="submit" className="btn btn-primary" disabled={sending}>
            {sending ? "Enviando…" : "Comentar"}
          </button>
        </div>
      </form>
    </section>
  );
}
