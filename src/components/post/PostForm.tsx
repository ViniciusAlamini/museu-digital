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
import { postSchema, PostFormValues } from "@/lib/validations";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Post } from "@/types";
import { ManuscriptEditor } from "@/components/shared/ManuscriptEditor";

interface PostFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: Partial<Post>;
  submitLabel?: string;
  cancelHref: string;
}

export function PostForm({
  action,
  defaultValues,
  submitLabel = "Publicar Post",
  cancelHref,
}: PostFormProps) {
  const router = useRouter();
  const [uploadingImage, setUploadingImage] = useState(false);
  const { formId, failure, saved, submit } = useFormFeedback(action);
  const [editorContent, setEditorContent] = useState(
    defaultValues?.content ?? "",
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      content: defaultValues?.content ?? "",
      image: defaultValues?.image ?? "",
      author: defaultValues?.author ?? "",
      publishedAt: defaultValues?.publishedAt
        ? new Date(defaultValues.publishedAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    },
  });

  const image = useWatch({ control, name: "image" });

  async function onSubmit(values: PostFormValues) {
    if (uploadingImage) return;
    const formData = formDataFromValues(values);
    formData.set("content", editorContent);
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
          placeholder="Título do post"
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
            placeholder="Nome do autor"
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
          <label htmlFor={`${formId}-publishedAt`} className={labelClass}>
            Data de Publicação *
          </label>
          <input
            id={`${formId}-publishedAt`}
            aria-required="true"
            aria-invalid={Boolean(errors.publishedAt)}
            aria-describedby={
              errors.publishedAt ? `${formId}-publishedAt-error` : undefined
            }
            {...register("publishedAt")}
            type="date"
            className={inputClass}
          />
          {errors.publishedAt && (
            <p
              id={`${formId}-publishedAt-error`}
              className={errorClass}
              role="alert"
            >
              {errors.publishedAt.message}
            </p>
          )}
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
      />

      <ImageUpload
        onUploadChange={setUploadingImage}
        value={image}
        onChange={(url) =>
          setValue("image", url, { shouldValidate: true, shouldDirty: true })
        }
        folder="posts"
        label="Imagem de Capa (opcional)"
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
          {isSubmitting ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
