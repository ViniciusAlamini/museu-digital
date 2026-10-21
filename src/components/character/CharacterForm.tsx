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
  const [uploadingImage, setUploadingImage] = useState(false);
  const { formId, failure, saved, submit } = useFormFeedback(action);

  const {
    register,
    handleSubmit,
    setValue,
    control,
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

  const image = useWatch({ control, name: "image" });

  async function onSubmit(values: CharacterFormValues) {
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
      <div className="form-grid">
        <div>
          <label htmlFor={`${formId}-name`} className={labelClass}>
            Nome *
          </label>
          <input
            id={`${formId}-name`}
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
            {...register("name")}
            placeholder="Nome do personagem"
            className={inputClass}
          />
          {errors.name && (
            <p id={`${formId}-name-error`} className={errorClass} role="alert">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${formId}-player`} className={labelClass}>
            Jogador *
          </label>
          <input
            id={`${formId}-player`}
            aria-required="true"
            aria-invalid={Boolean(errors.player)}
            aria-describedby={
              errors.player ? `${formId}-player-error` : undefined
            }
            {...register("player")}
            placeholder="Nome do jogador"
            className={inputClass}
          />
          {errors.player && (
            <p
              id={`${formId}-player-error`}
              className={errorClass}
              role="alert"
            >
              {errors.player.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${formId}-race`} className={labelClass}>
            Raça *
          </label>
          <input
            id={`${formId}-race`}
            aria-required="true"
            aria-invalid={Boolean(errors.race)}
            aria-describedby={errors.race ? `${formId}-race-error` : undefined}
            {...register("race")}
            placeholder="Ex: Humano, Elfo, Anão"
            className={inputClass}
          />
          {errors.race && (
            <p id={`${formId}-race-error`} className={errorClass} role="alert">
              {errors.race.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${formId}-characterClass`} className={labelClass}>
            Classe *
          </label>
          <input
            id={`${formId}-characterClass`}
            aria-required="true"
            aria-invalid={Boolean(errors.characterClass)}
            aria-describedby={
              errors.characterClass
                ? `${formId}-characterClass-error`
                : undefined
            }
            {...register("characterClass")}
            placeholder="Ex: Guerreiro, Mago, Ladino"
            className={inputClass}
          />
          {errors.characterClass && (
            <p
              id={`${formId}-characterClass-error`}
              className={errorClass}
              role="alert"
            >
              {errors.characterClass.message}
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
          placeholder="Histórico, personalidade, aparência..."
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
        onUploadChange={setUploadingImage}
        value={image}
        onChange={(url) =>
          setValue("image", url, { shouldValidate: true, shouldDirty: true })
        }
        folder="characters"
        label="Imagem do Personagem"
        aspectRatio="portrait"
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
