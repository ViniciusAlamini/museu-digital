"use client";

import { useState } from "react";
import {
  formDataFromValues,
  FormFeedback,
  useFormFeedback,
} from "@/components/shared/FormFeedback";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const { formId, failure, saved, submit } = useFormFeedback(action);

  const {
    register,
    handleSubmit,
    setValue,
    control,
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

  const coverImage = useWatch({ control, name: "coverImage" });

  async function onSubmit(values: CampaignFormValues) {
    if (uploadingImage) return;
    const formData = formDataFromValues(values);
    formData.set("coverImage", coverImage ?? "");
    await submit(formData);
  }

  const inputClass = "field";
  const labelClass = "field-label";
  const errorClass = "field-error";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="archive-form"
      noValidate
      aria-busy={isSubmitting}
    >
      <p className="form-intro">
        Os campos com * são obrigatórios. Registre os detalhes que deseja
        guardar no acervo.
      </p>
      <div className="form-grid">
        <div>
          <label htmlFor={`${formId}-name`} className={labelClass}>
            Nome da Campanha *
          </label>
          <input
            id={`${formId}-name`}
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
            {...register("name")}
            placeholder="Ex: A Maldição de Strahd"
            className={inputClass}
          />
          {errors.name && (
            <p id={`${formId}-name-error`} className={errorClass} role="alert">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${formId}-system`} className={labelClass}>
            Sistema de RPG *
          </label>
          <input
            id={`${formId}-system`}
            aria-required="true"
            aria-invalid={Boolean(errors.system)}
            aria-describedby={
              errors.system ? `${formId}-system-error` : undefined
            }
            {...register("system")}
            placeholder="Ex: D&D 5e, Pathfinder, Vampire"
            className={inputClass}
          />
          {errors.system && (
            <p
              id={`${formId}-system-error`}
              className={errorClass}
              role="alert"
            >
              {errors.system.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-description`} className={labelClass}>
          Descrição *
        </label>
        <textarea
          id={`${formId}-description`}
          aria-required="true"
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? `${formId}-description-error` : undefined
          }
          {...register("description")}
          rows={4}
          placeholder="Descreva a campanha..."
          className={inputClass}
        />
        {errors.description && (
          <p
            id={`${formId}-description-error`}
            className={errorClass}
            role="alert"
          >
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${formId}-startDate`} className={labelClass}>
          Data de Início *
        </label>
        <input
          id={`${formId}-startDate`}
          aria-required="true"
          aria-invalid={Boolean(errors.startDate)}
          aria-describedby={
            errors.startDate ? `${formId}-startDate-error` : undefined
          }
          {...register("startDate")}
          type="date"
          className={inputClass}
        />
        {errors.startDate && (
          <p
            id={`${formId}-startDate-error`}
            className={errorClass}
            role="alert"
          >
            {errors.startDate.message}
          </p>
        )}
      </div>

      <ImageUpload
        onUploadChange={setUploadingImage}
        value={coverImage}
        onChange={(url) =>
          setValue("coverImage", url, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
        folder="campaigns"
        label="Imagem de Capa"
        aspectRatio="wide"
      />

      <FormFeedback
        failure={failure}
        saved={saved}
        busy={isSubmitting}
        invalid={Object.keys(errors).length > 0}
      />

      <div className="form-actions">
        <button
          type="button"
          onClick={() =>
            router.push(
              defaultValues?.id ? `/campaigns/${defaultValues.id}` : "/",
            )
          }
          className="btn btn-secondary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || uploadingImage}
          className="btn btn-primary"
        >
          {isSubmitting ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
