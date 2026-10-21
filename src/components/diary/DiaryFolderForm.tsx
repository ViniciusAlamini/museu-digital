"use client";

import {
  formDataFromValues,
  FormFeedback,
  useFormFeedback,
} from "@/components/shared/FormFeedback";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { diaryFolderSchema, DiaryFolderFormValues } from "@/lib/validations";

interface DiaryFolderFormProps {
  action: (formData: FormData) => Promise<void>;
  folders: { id: string; name: string }[];
  currentParentId?: string;
  cancelHref: string;
}

export function DiaryFolderForm({
  action,
  folders,
  currentParentId,
  cancelHref,
}: DiaryFolderFormProps) {
  const router = useRouter();
  const { formId, failure, saved, submit } = useFormFeedback(action);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DiaryFolderFormValues>({
    resolver: zodResolver(diaryFolderSchema),
    defaultValues: {
      name: "",
      description: "",
      parentFolderId: currentParentId ?? "",
    },
  });

  const inputClass = "field";
  const labelClass = "field-label";
  const errorClass = "field-error";

  return (
    <form
      onSubmit={handleSubmit((values) => submit(formDataFromValues(values)))}
      className="archive-form"
      noValidate
      aria-busy={isSubmitting}
    >
      <p className="form-intro">
        Os campos com * são obrigatórios. Registre os detalhes que deseja
        guardar no acervo.
      </p>
      <div>
        <label htmlFor={`${formId}-name`} className={labelClass}>
          Nome da Pasta *
        </label>
        <input
          id={`${formId}-name`}
          aria-required="true"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          {...register("name")}
          placeholder="Ex: Capítulo 1"
          className={inputClass}
        />
        {errors.name && (
          <p id={`${formId}-name-error`} className={errorClass} role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${formId}-parentFolderId`} className={labelClass}>
          Pasta Pai (Opcional)
        </label>
        <select
          id={`${formId}-parentFolderId`}
          aria-invalid={Boolean(errors.parentFolderId)}
          aria-describedby={
            errors.parentFolderId ? `${formId}-parentFolderId-error` : undefined
          }
          {...register("parentFolderId")}
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
        <label htmlFor={`${formId}-description`} className={labelClass}>
          Descrição (Opcional)
        </label>
        <textarea
          id={`${formId}-description`}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? `${formId}-description-error` : undefined
          }
          {...register("description")}
          rows={3}
          className={inputClass}
        />
      </div>

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
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? "Criando..." : "Criar Pasta"}
        </button>
      </div>
    </form>
  );
}
