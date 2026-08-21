"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { campaignSchema, CampaignFormValues } from "@/lib/validations";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Campaign } from "@/types";

interface CampaignFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: Partial<Campaign>;
  submitLabel?: string;
}

export function CampaignForm({
  action,
  defaultValues,
  submitLabel = "Criar Campanha",
}: CampaignFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      system: defaultValues?.system ?? "",
      description: defaultValues?.description ?? "",
      coverImage: defaultValues?.coverImage ?? "",
      startDate: defaultValues?.startDate
        ? new Date(defaultValues.startDate).toISOString().split("T")[0]
        : "",
    },
  });

  const coverImage = watch("coverImage");

  async function onSubmit() {
    const formData = new FormData(formRef.current!);
    formData.set("coverImage", coverImage ?? "");
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
          <label className={labelClass}>Nome da Campanha *</label>
          <input
            {...register("name")}
            placeholder="Ex: A Maldição de Strahd"
            className={inputClass}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Sistema de RPG *</label>
          <input
            {...register("system")}
            placeholder="Ex: D&D 5e, Pathfinder, Vampire"
            className={inputClass}
          />
          {errors.system && <p className={errorClass}>{errors.system.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Descrição *</label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Descreva a campanha..."
          className={`${inputClass} resize-none`}
        />
        {errors.description && (
          <p className={errorClass}>{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>Data de Início *</label>
        <input
          {...register("startDate")}
          type="date"
          className={inputClass}
        />
        {errors.startDate && (
          <p className={errorClass}>{errors.startDate.message}</p>
        )}
      </div>

      <ImageUpload
        value={coverImage}
        onChange={(url) => setValue("coverImage", url)}
        folder="campaigns"
        label="Imagem de Capa"
        aspectRatio="wide"
      />

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
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
