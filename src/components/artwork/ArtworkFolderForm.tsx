"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { artworkFolderSchema } from "@/lib/validations";
import { z } from "zod";

type ArtworkFolderFormValues = z.infer<typeof artworkFolderSchema>;

interface ArtworkFolderFormProps {
  action: (formData: FormData) => Promise<void>;
  folders: { id: string; name: string }[];
  currentParentId?: string;
  cancelHref: string;
}

export function ArtworkFolderForm({ action, folders, currentParentId, cancelHref }: ArtworkFolderFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ArtworkFolderFormValues>({
    resolver: zodResolver(artworkFolderSchema),
    defaultValues: {
      name: "",
      description: "",
      parentFolderId: currentParentId ?? "",
    },
  });

  const inputClass =
    "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-purple)] transition-colors";
  const labelClass = "block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5";
  const errorClass = "mt-1 text-xs text-red-400";

  return (
    <form ref={formRef} onSubmit={handleSubmit(() => action(new FormData(formRef.current!)))} className="space-y-6">
      <div>
        <label className={labelClass}>Nome da Pasta *</label>
        <input {...register("name")} placeholder="Ex: Mapas da Masmorra" className={inputClass} />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Pasta Pai (Opcional)</label>
        <select {...register("parentFolderId")} className={inputClass}>
          <option value="">Raiz de Desenhos</option>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Descrição (Opcional)</label>
        <textarea {...register("description")} rows={3} className={inputClass} />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push(cancelHref)}
          className="flex-1 rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-[var(--color-accent-purple)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-60 transition-colors"
        >
          {isSubmitting ? "Criando..." : "Criar Pasta"}
        </button>
      </div>
    </form>
  );
}
