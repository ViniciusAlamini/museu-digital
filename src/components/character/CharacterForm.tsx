"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { characterSchema, CharacterFormValues } from "@/lib/validations";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Character } from "@/types";

interface CharacterFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: Partial<Character>;
  submitLabel?: string;
  cancelHref: string;
}

export function CharacterForm({
  action,
  defaultValues,
  submitLabel = "Criar Personagem",
  cancelHref,
}: CharacterFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CharacterFormValues>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      player: defaultValues?.player ?? "",
      image: defaultValues?.image ?? "",
      race: defaultValues?.race ?? "",
      characterClass: defaultValues?.characterClass ?? "",
      description: defaultValues?.description ?? "",
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
          <label className={labelClass}>Nome *</label>
          <input {...register("name")} placeholder="Nome do personagem" className={inputClass} />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Jogador *</label>
          <input {...register("player")} placeholder="Nome do jogador" className={inputClass} />
          {errors.player && <p className={errorClass}>{errors.player.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Raça *</label>
          <input {...register("race")} placeholder="Ex: Humano, Elfo, Anão" className={inputClass} />
          {errors.race && <p className={errorClass}>{errors.race.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Classe *</label>
          <input {...register("characterClass")} placeholder="Ex: Guerreiro, Mago, Ladino" className={inputClass} />
          {errors.characterClass && <p className={errorClass}>{errors.characterClass.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Descrição *</label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Histórico, personalidade, aparência..."
          className={`${inputClass} resize-none`}
        />
        {errors.description && <p className={errorClass}>{errors.description.message}</p>}
      </div>

      <ImageUpload
        value={image}
        onChange={(url) => setValue("image", url)}
        folder="characters"
        label="Imagem do Personagem"
        aspectRatio="portrait"
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
          {isSubmitting ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
