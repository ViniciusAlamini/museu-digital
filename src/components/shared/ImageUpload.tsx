"use client";

import { useId, useRef, useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import { ArchiveImage } from "./ArchiveImage";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
  aspectRatio?: "square" | "wide" | "portrait";
  onUploadChange?: (uploading: boolean) => void;
  error?: string;
  required?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  folder,
  label = "Imagem",
  aspectRatio = "wide",
  onUploadChange,
  error: validationError,
  required,
}: ImageUploadProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const pending = useRef(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const visibleError = error || validationError;

  async function handleFile(file: File) {
    if (pending.current) return;
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione uma imagem.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("A imagem deve ter até 10 MB.");
      return;
    }
    pending.current = true;
    setError("");
    setUploading(true);
    onUploadChange?.(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error("Upload failed");
      onChange(data.url);
    } catch {
      setError("Não foi possível enviar a imagem. Tente novamente.");
    } finally {
      pending.current = false;
      setUploading(false);
      onUploadChange?.(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      className="image-upload"
      aria-busy={uploading}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) void handleFile(file);
      }}
      onDragOver={(event) => event.preventDefault()}
    >
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {value ? (
        <div className="image-upload-preview" data-aspect={aspectRatio}>
          <ArchiveImage
            src={value}
            alt={label.replace(/\s*\*$/, "")}
            fill
            variant={aspectRatio === "portrait" ? "portrait" : "artwork"}
          />
        </div>
      ) : (
        <div className="image-upload-empty">
          <ImageIcon size={28} aria-hidden="true" />
          <p>
            Nenhuma imagem selecionada.
            <br />
            <span className="form-help">
              Escolha um arquivo ou arraste-o para esta área.
            </span>
          </p>
        </div>
      )}
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept="image/*"
        disabled={uploading}
        aria-required={required}
        aria-describedby={`${id}-help${visibleError ? ` ${id}-error` : ""}`}
        aria-invalid={Boolean(visibleError)}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <div className="image-upload-actions">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={16} aria-hidden="true" />
          {uploading
            ? "Enviando…"
            : value
              ? "Trocar imagem"
              : "Escolher imagem"}
        </button>
        {value && (
          <button
            type="button"
            className="btn btn-ghost"
            disabled={uploading}
            onClick={() => onChange("")}
          >
            <X size={16} aria-hidden="true" />
            Remover imagem
          </button>
        )}
      </div>
      <p id={`${id}-help`} className="form-help">
        PNG, JPG ou WEBP · até 10 MB
      </p>
      <div aria-live="polite">
        {uploading && (
          <p className="form-help">
            Aguarde o envio da imagem antes de salvar.
          </p>
        )}
        {visibleError && (
          <p id={`${id}-error`} className="field-error" role="alert">
            {visibleError}
          </p>
        )}
      </div>
    </div>
  );
}
