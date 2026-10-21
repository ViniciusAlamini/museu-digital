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
  const [uploadingImage, setUploadingImage] = useState(false);
  const { formId, failure, saved, submit } = useFormFeedback(action);

  const {
    register,
    handleSubmit,
    setValue,
    control,
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

  const image = useWatch({ control, name: "image" });

  async function onSubmit(values: ArtworkFormValues) {
    if (uploadingImage) return;
    const formData = formDataFromValues(values);
    formData.set("image", image ?? "");

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
      <input type="hidden" {...register("folderId")} />

      <div className="form-grid">
        <div>
          <label htmlFor={`${formId}-title`} className={labelClass}>
            Título *
          </label>
          <input
            id={`${formId}-title`}
            aria-required="true"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={
              errors.title ? `${formId}-title-error` : undefined
            }
            {...register("title")}
            placeholder="Título do desenho"
            className={inputClass}
          />
          {errors.title && (
            <p id={`${formId}-title-error`} className={errorClass} role="alert">
              {errors.title.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${formId}-artist`} className={labelClass}>
            Artista *
          </label>
          <input
            id={`${formId}-artist`}
            aria-required="true"
            aria-invalid={Boolean(errors.artist)}
            aria-describedby={
              errors.artist ? `${formId}-artist-error` : undefined
            }
            {...register("artist")}
            placeholder="Nome do artista"
            className={inputClass}
          />
          {errors.artist && (
            <p
              id={`${formId}-artist-error`}
              className={errorClass}
              role="alert"
            >
              {errors.artist.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-date`} className={labelClass}>
          Data *
        </label>
        <input
          id={`${formId}-date`}
          aria-required="true"
          aria-invalid={Boolean(errors.date)}
          aria-describedby={errors.date ? `${formId}-date-error` : undefined}
          {...register("date")}
          type="date"
          className={inputClass}
        />
        {errors.date && (
          <p id={`${formId}-date-error`} className={errorClass} role="alert">
            {errors.date.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${formId}-description`} className={labelClass}>
          Descrição
        </label>
        <textarea
          id={`${formId}-description`}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? `${formId}-description-error` : undefined
          }
          {...register("description")}
          rows={3}
          placeholder="Descreva o desenho..."
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

      <ImageUpload
        error={errors.image?.message}
        required
        onUploadChange={setUploadingImage}
        value={image}
        onChange={(url) =>
          setValue("image", url, { shouldValidate: true, shouldDirty: true })
        }
        folder="artworks"
        label="Imagem *"
        aspectRatio="square"
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
          onClick={() => router.push(cancelHref)}
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
