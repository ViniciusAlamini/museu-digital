"use client";

import { useState } from "react";
import {
  formDataFromValues,
  FormFeedback,
  useFormFeedback,
} from "@/components/shared/FormFeedback";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { diaryEntrySchema, DiaryEntryFormValues } from "@/lib/validations";
import { DiaryEntry } from "@/types";
import { ManuscriptEditor } from "@/components/shared/ManuscriptEditor";

interface DiaryEntryFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: Partial<DiaryEntry>;
  characters: { id: string; name: string }[];
  folders: { id: string; name: string }[];
  currentFolderId?: string;
  submitLabel?: string;
  cancelHref: string;
}

export function DiaryEntryForm({
  action,
  defaultValues,
  characters,
  folders,
  currentFolderId,
  submitLabel = "Salvar Entrada",
  cancelHref,
}: DiaryEntryFormProps) {
  const router = useRouter();
  const { formId, failure, saved, submit } = useFormFeedback(action);
  const [editorContent, setEditorContent] = useState(
    defaultValues?.content ?? "",
  );
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DiaryEntryFormValues>({
    resolver: zodResolver(diaryEntrySchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      content: defaultValues?.content ?? "",
      author: defaultValues?.author ?? "",
      relatedCharacterId: defaultValues?.relatedCharacterId ?? "",
      folderId: defaultValues?.folderId ?? currentFolderId ?? "",
      date: defaultValues?.date
        ? new Date(defaultValues.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    },
  });

  async function onSubmit(values: DiaryEntryFormValues) {
    if (uploadingImage) return;
    const formData = formDataFromValues(values);
    formData.set("content", editorContent);
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
      <div>
        <label htmlFor={`${formId}-title`} className={labelClass}>
          Título *
        </label>
        <input
          id={`${formId}-title`}
          aria-required="true"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? `${formId}-title-error` : undefined}
          {...register("title")}
          placeholder="Ex: A chegada em Ten-Towns"
          className={inputClass}
        />
        {errors.title && (
          <p id={`${formId}-title-error`} className={errorClass} role="alert">
            {errors.title.message}
          </p>
        )}
      </div>

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
            placeholder="Quem está escrevendo?"
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
      </div>

      <div className="form-grid">
        <div>
          <label htmlFor={`${formId}-folderId`} className={labelClass}>
            Pasta
          </label>
          <select
            id={`${formId}-folderId`}
            aria-invalid={Boolean(errors.folderId)}
            aria-describedby={
              errors.folderId ? `${formId}-folderId-error` : undefined
            }
            {...register("folderId")}
            className={inputClass}
          >
            <option value="">Raiz do Diário</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor={`${formId}-relatedCharacterId`}
            className={labelClass}
          >
            Vincular Personagem (Opcional)
          </label>
          <select
            id={`${formId}-relatedCharacterId`}
            aria-invalid={Boolean(errors.relatedCharacterId)}
            aria-describedby={
              errors.relatedCharacterId
                ? `${formId}-relatedCharacterId-error`
                : undefined
            }
            {...register("relatedCharacterId")}
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
      </div>

      <ManuscriptEditor
        id={`${formId}-content`}
        value={editorContent}
        onChange={(html) => {
          setEditorContent(html);
          setValue("content", html, { shouldValidate: true });
        }}
        error={errors.content?.message}
        diary
        onUploadChange={setUploadingImage}
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
