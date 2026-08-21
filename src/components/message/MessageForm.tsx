"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema, MessageFormValues } from "@/lib/validations";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Message } from "@/types";

const MESSAGE_TYPES = [
  "Mensagem pessoal",
  "Pensamento do personagem",
  "Mensagem para outro personagem",
  "Mensagem para o grupo",
  "Registro de um momento da campanha",
];

interface MessageFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: Partial<Message>;
  characters: { id: string; name: string }[];
  submitLabel?: string;
  cancelHref: string;
}

export function MessageForm({
  action,
  defaultValues,
  characters,
  submitLabel = "Postar Mensagem",
  cancelHref,
}: MessageFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      content: defaultValues?.content ?? "",
      author: defaultValues?.author ?? "",
      characterId: defaultValues?.characterId ?? "",
      eventDate: defaultValues?.eventDate
        ? new Date(defaultValues.eventDate).toISOString().split("T")[0]
        : "",
      image: defaultValues?.image ?? "",
      type: defaultValues?.type ?? MESSAGE_TYPES[0],
    },
  });

  const image = watch("image");

  async function onSubmit() {
    const formData = new FormData(formRef.current!);
    formData.set("image", image ?? "");
    await action(formData);
  }

  const inputClass =
    "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-purple)] transition-colors";
  const labelClass = "block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5";
  const errorClass = "mt-1 text-xs text-red-400";

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Autor *</label>
          <input {...register("author")} placeholder="Seu nome" className={inputClass} />
          {errors.author && <p className={errorClass}>{errors.author.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Tipo de Mensagem *</label>
          <select {...register("type")} className={inputClass}>
            {MESSAGE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.type && <p className={errorClass}>{errors.type.message}</p>}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Vincular Personagem (Opcional)</label>
          <select {...register("characterId")} className={inputClass}>
            <option value="">Nenhum</option>
            {characters.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Data do Acontecimento (Opcional)</label>
          <input {...register("eventDate")} type="date" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Título (Opcional)</label>
        <input {...register("title")} placeholder="Resumo do pensamento ou relato" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Conteúdo da Mensagem *</label>
        <textarea
          {...register("content")}
          rows={6}
          placeholder="O que está acontecendo..."
          className={inputClass}
        />
        {errors.content && <p className={errorClass}>{errors.content.message}</p>}
      </div>

      <ImageUpload
        value={image}
        onChange={(url) => setValue("image", url)}
        folder="posts"
        label="Imagem anexada (opcional)"
        aspectRatio="wide"
      />

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
          {isSubmitting ? "Enviando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
