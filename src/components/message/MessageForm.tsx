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
  const [uploadingImage, setUploadingImage] = useState(false);
  const { formId, failure, saved, submit } = useFormFeedback(action);

  const {
    register,
    handleSubmit,
    setValue,
    control,
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

  const image = useWatch({ control, name: "image" });

  async function onSubmit(values: MessageFormValues) {
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
          <label htmlFor={`${formId}-author`} className={labelClass}>
            Autor *
          </label>
          <input
            id={`${formId}-author`}
            aria-required="true"
            aria-invalid={Boolean(errors.author)}
            aria-describedby={
              errors.author ? `${formId}-author-error` : undefined
            }
            {...register("author")}
            placeholder="Seu nome"
            className={inputClass}
          />
          {errors.author && (
            <p
              id={`${formId}-author-error`}
              className={errorClass}
              role="alert"
            >
              {errors.author.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${formId}-type`} className={labelClass}>
            Tipo de Mensagem *
          </label>
          <select
            id={`${formId}-type`}
            aria-required="true"
            aria-invalid={Boolean(errors.type)}
            aria-describedby={errors.type ? `${formId}-type-error` : undefined}
            {...register("type")}
            className={inputClass}
          >
            {MESSAGE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.type && (
            <p id={`${formId}-type-error`} className={errorClass} role="alert">
              {errors.type.message}
            </p>
          )}
        </div>
      </div>

      <div className="form-grid">
        <div>
          <label htmlFor={`${formId}-characterId`} className={labelClass}>
            Vincular Personagem (Opcional)
          </label>
          <select
            id={`${formId}-characterId`}
            aria-invalid={Boolean(errors.characterId)}
            aria-describedby={
              errors.characterId ? `${formId}-characterId-error` : undefined
            }
            {...register("characterId")}
            className={inputClass}
          >
            <option value="">Nenhum</option>
            {characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${formId}-eventDate`} className={labelClass}>
            Data do Acontecimento (Opcional)
          </label>
          <input
            id={`${formId}-eventDate`}
            aria-invalid={Boolean(errors.eventDate)}
            aria-describedby={
              errors.eventDate ? `${formId}-eventDate-error` : undefined
            }
            {...register("eventDate")}
            type="date"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-title`} className={labelClass}>
          Título (Opcional)
        </label>
        <input
          id={`${formId}-title`}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? `${formId}-title-error` : undefined}
          {...register("title")}
          placeholder="Resumo do pensamento ou relato"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor={`${formId}-content`} className={labelClass}>
          Conteúdo da Mensagem *
        </label>
        <textarea
          id={`${formId}-content`}
          aria-required="true"
          aria-invalid={Boolean(errors.content)}
          aria-describedby={
            errors.content ? `${formId}-content-error` : undefined
          }
          {...register("content")}
          rows={6}
          placeholder="O que está acontecendo..."
          className={inputClass}
        />
        {errors.content && (
          <p id={`${formId}-content-error`} className={errorClass} role="alert">
            {errors.content.message}
          </p>
        )}
      </div>

      <ImageUpload
        onUploadChange={setUploadingImage}
        value={image}
        onChange={(url) =>
          setValue("image", url, { shouldValidate: true, shouldDirty: true })
        }
        folder="posts"
        label="Imagem anexada (opcional)"
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
          {isSubmitting ? "Enviando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
