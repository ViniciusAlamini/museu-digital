"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { artworkSchema, ArtworkFormValues } from "@/lib/validations";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Artwork } from "@/types";

interface ArtworkFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: Partial<Artwork>;
  submitLabel?: string;
  cancelHref: string;
}

export function ArtworkForm({
  action,
  defaultValues,
  submitLabel = "Adicionar Desenho",
  cancelHref,
}: ArtworkFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      image: defaultValues?.image ?? "",
      artist: defaultValues?.artist ?? "",
      description: defaultValues?.description ?? "",
      date: defaultValues?.date
        ? new Date(defaultValues.date).toISOString().split("T")[0]
        : "",
      folderId: defaultValues?.folderId ?? "",
    },
  });

  const image = watch("image");

  async function onSubmit() {
    const formData = new FormData(formRef.current!);
    formData.set("image", image ?? "");
    // Ensure folderId is captured correctly
    const folderId = watch("folderId");
    if (folderId) formData.set("folderId", folderId);
    
    await action(formData);
  }

  const inputClass =
    "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-purple)] transition-colors";
  const labelClass = "block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5";
  const errorClass = "mt-1 text-xs text-red-400";

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...register("folderId")} />
      
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Título *</label>
          <input {...register("title")} placeholder="Título do desenho" className={inputClass} />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Artista *</label>
          <input {...register("artist")} placeholder="Nome do artista" className={inputClass} />
          {errors.artist && <p className={errorClass}>{errors.artist.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Data *</label>
        <input {...register("date")} type="date" className={inputClass} />
        {errors.date && <p className={errorClass}>{errors.date.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Descrição *</label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Descreva o desenho..."
          className={`${inputClass} resize-none`}
        />
        {errors.description && <p className={errorClass}>{errors.description.message}</p>}
      </div>

      <ImageUpload
        value={image}
        onChange={(url) => setValue("image", url)}
        folder="artworks"
        label="Imagem *"
        aspectRatio="square"
      />
      {errors.image && <p className={errorClass}>{errors.image.message}</p>}

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
          {isSubmitting ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
