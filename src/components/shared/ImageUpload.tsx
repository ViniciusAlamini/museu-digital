"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
  aspectRatio?: "square" | "wide" | "portrait";
}

export function ImageUpload({
  value,
  onChange,
  folder,
  label = "Imagem",
  aspectRatio = "wide",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aspectClass = {
    square: "aspect-square",
    wide: "aspect-video",
    portrait: "aspect-[3/4]",
  }[aspectRatio];

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Por favor selecione uma imagem.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("A imagem deve ter menos de 10MB.");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      } else {
        setError("Erro ao enviar imagem.");
      }
    } catch {
      setError("Erro ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--color-text-secondary)]">
        {label}
      </label>
      <div
        className={`relative ${aspectClass} rounded-lg border-2 border-dashed border-[var(--color-border)] overflow-hidden group cursor-pointer hover:border-[var(--color-accent-purple)] transition-colors`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-sm font-medium">Trocar imagem</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[var(--color-text-muted)]">
            {uploading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent-purple)] border-t-transparent" />
            ) : (
              <>
                <ImageIcon className="h-10 w-10" />
                <p className="text-sm font-medium">Clique ou arraste uma imagem</p>
                <p className="text-xs">PNG, JPG, WEBP até 10MB</p>
              </>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
