"use client";

import { useId, useState } from "react";

export function formDataFromValues(values: Record<string, unknown>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values))
    data.set(key, value == null ? "" : String(value));
  return data;
}

export function useFormFeedback(action: (data: FormData) => Promise<void>) {
  const formId = useId();
  const [failure, setFailure] = useState("");
  const [saved, setSaved] = useState(false);

  async function submit(data: FormData) {
    setFailure("");
    setSaved(false);
    try {
      await action(data);
      setSaved(true);
    } catch (error) {
      // Let Next finish navigation when an action redirects.
      if (
        error &&
        typeof error === "object" &&
        "digest" in error &&
        typeof error.digest === "string" &&
        error.digest.startsWith("NEXT_REDIRECT")
      )
        throw error;
      setFailure(
        "Não foi possível salvar. Seus dados continuam no formulário. Tente novamente.",
      );
    }
  }

  return { formId, failure, saved, submit };
}

export function FormFeedback({
  failure,
  saved,
  busy,
  invalid,
}: {
  failure: string;
  saved: boolean;
  busy: boolean;
  invalid: boolean;
}) {
  return (
    <div className="form-feedback" aria-live="polite" aria-atomic="true">
      {failure ? (
        <p className="field-error" role="alert">
          {failure}
        </p>
      ) : busy ? (
        <p>Salvando o registro…</p>
      ) : invalid ? (
        <p className="field-error">
          Revise os campos indicados antes de salvar.
        </p>
      ) : saved ? (
        <p>Registro salvo.</p>
      ) : null}
    </div>
  );
}
