"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { diaryEntrySchema, DiaryEntryFormValues } from "@/lib/validations";
import { DiaryEntry } from "@/types";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import ImageExtension from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Minus,
  ImageIcon,
} from "lucide-react";

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
  const formRef = useRef<HTMLFormElement>(null);
  const [editorContent, setEditorContent] = useState(defaultValues?.content ?? "");
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

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      Placeholder.configure({ placeholder: "Escreva o diário aqui..." }),
    ],
    content: defaultValues?.content ?? "",
    onUpdate({ editor }) {
      const html = editor.getHTML();
      setEditorContent(html);
      setValue("content", html, { shouldValidate: true });
    },
  });

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      if (input.files?.length) {
        setUploadingImage(true);
        const file = input.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "posts"); // Reuse posts folder for simplicity

        try {
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const data = await res.json();
          if (data.url && editor) {
            editor.chain().focus().setImage({ src: data.url }).run();
          }
        } catch (error) {
          console.error("Upload failed", error);
        } finally {
          setUploadingImage(false);
        }
      }
    };
    input.click();
  };

  async function onSubmit() {
    const formData = new FormData(formRef.current!);
    formData.set("content", editorContent);
    await action(formData);
  }

  const inputClass =
    "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-purple)] transition-colors";
  const labelClass = "block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5";
  const errorClass = "mt-1 text-xs text-red-400";

  const toolbarBtn = (onClick: () => void, active: boolean, icon: React.ReactNode, disabled = false) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${
        active
          ? "bg-[var(--color-accent-purple)]/20 text-[var(--color-accent-purple)]"
          : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]"
      }`}
    >
      {icon}
    </button>
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className={labelClass}>Título *</label>
        <input {...register("title")} placeholder="Ex: A chegada em Ten-Towns" className={inputClass} />
        {errors.title && <p className={errorClass}>{errors.title.message}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Autor *</label>
          <input {...register("author")} placeholder="Quem está escrevendo?" className={inputClass} />
          {errors.author && <p className={errorClass}>{errors.author.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Data *</label>
          <input {...register("date")} type="date" className={inputClass} />
          {errors.date && <p className={errorClass}>{errors.date.message}</p>}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Pasta</label>
          <select {...register("folderId")} className={inputClass}>
            <option value="">Raiz do Diário</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Vincular Personagem (Opcional)</label>
          <select {...register("relatedCharacterId")} className={inputClass}>
            <option value="">Nenhum</option>
            {characters.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Rich Text Editor */}
      <div>
        <label className={labelClass}>Conteúdo *</label>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] overflow-hidden focus-within:border-[var(--color-accent-purple)] focus-within:ring-1 focus-within:ring-[var(--color-accent-purple)] transition-colors">
          <div className="flex items-center gap-1 border-b border-[var(--color-border)] px-3 py-2 flex-wrap">
            {editor && (
              <>
                {toolbarBtn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }), <Heading2 className="h-4 w-4" />)}
                {toolbarBtn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive("heading", { level: 3 }), <Heading3 className="h-4 w-4" />)}
                <div className="h-4 w-px bg-[var(--color-border)] mx-1" />
                {toolbarBtn(() => editor.chain().focus().toggleBold().run(), editor.isActive("bold"), <Bold className="h-4 w-4" />)}
                {toolbarBtn(() => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"), <Italic className="h-4 w-4" />)}
                <div className="h-4 w-px bg-[var(--color-border)] mx-1" />
                {toolbarBtn(() => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"), <List className="h-4 w-4" />)}
                {toolbarBtn(() => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"), <ListOrdered className="h-4 w-4" />)}
                <div className="h-4 w-px bg-[var(--color-border)] mx-1" />
                {toolbarBtn(() => editor.chain().focus().toggleBlockquote().run(), editor.isActive("blockquote"), <Quote className="h-4 w-4" />)}
                {toolbarBtn(() => editor.chain().focus().setHorizontalRule().run(), false, <Minus className="h-4 w-4" />)}
                <div className="h-4 w-px bg-[var(--color-border)] mx-1" />
                {toolbarBtn(addImage, false, <ImageIcon className="h-4 w-4" />, uploadingImage)}
              </>
            )}
          </div>
          <EditorContent
            editor={editor}
            className="prose-rpg text-sm min-h-[300px] max-h-[700px] overflow-y-auto p-4"
          />
        </div>
        {errors.content && <p className={errorClass}>{errors.content.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push(cancelHref)}
          className="flex-1 rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || uploadingImage}
          className="flex-1 rounded-lg bg-[var(--color-accent-purple)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-60 transition-colors"
        >
          {isSubmitting ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
