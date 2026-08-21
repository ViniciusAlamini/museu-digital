"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostFormValues } from "@/lib/validations";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Post } from "@/types";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
} from "lucide-react";

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
  const formRef = useRef<HTMLFormElement>(null);
  const [editorContent, setEditorContent] = useState(defaultValues?.content ?? "");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  const image = watch("image");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Escreva o conteúdo do post..." }),
    ],
    content: defaultValues?.content ?? "",
    onUpdate({ editor }) {
      const html = editor.getHTML();
      setEditorContent(html);
      setValue("content", html, { shouldValidate: true });
    },
  });

  async function onSubmit() {
    const formData = new FormData(formRef.current!);
    formData.set("content", editorContent);
    formData.set("image", image ?? "");
    await action(formData);
  }

  const inputClass =
    "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-purple)] transition-colors";
  const labelClass = "block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5";
  const errorClass = "mt-1 text-xs text-red-400";

  const toolbarBtn = (onClick: () => void, active: boolean, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${
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
        <input {...register("title")} placeholder="Título do post" className={inputClass} />
        {errors.title && <p className={errorClass}>{errors.title.message}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Autor *</label>
          <input {...register("author")} placeholder="Nome do autor" className={inputClass} />
          {errors.author && <p className={errorClass}>{errors.author.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Data de Publicação *</label>
          <input {...register("publishedAt")} type="date" className={inputClass} />
          {errors.publishedAt && <p className={errorClass}>{errors.publishedAt.message}</p>}
        </div>
      </div>

      {/* Rich Text Editor */}
      <div>
        <label className={labelClass}>Conteúdo *</label>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] overflow-hidden focus-within:border-[var(--color-accent-purple)] focus-within:ring-1 focus-within:ring-[var(--color-accent-purple)] transition-colors">
          {/* Toolbar */}
          <div className="flex items-center gap-1 border-b border-[var(--color-border)] px-3 py-2">
            {editor && (
              <>
                {toolbarBtn(
                  () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
                  editor.isActive("heading", { level: 2 }),
                  <Heading2 className="h-4 w-4" />
                )}
                {toolbarBtn(
                  () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
                  editor.isActive("heading", { level: 3 }),
                  <Heading3 className="h-4 w-4" />
                )}
                <div className="h-4 w-px bg-[var(--color-border)] mx-1" />
                {toolbarBtn(
                  () => editor.chain().focus().toggleBold().run(),
                  editor.isActive("bold"),
                  <Bold className="h-4 w-4" />
                )}
                {toolbarBtn(
                  () => editor.chain().focus().toggleItalic().run(),
                  editor.isActive("italic"),
                  <Italic className="h-4 w-4" />
                )}
                <div className="h-4 w-px bg-[var(--color-border)] mx-1" />
                {toolbarBtn(
                  () => editor.chain().focus().toggleBulletList().run(),
                  editor.isActive("bulletList"),
                  <List className="h-4 w-4" />
                )}
                {toolbarBtn(
                  () => editor.chain().focus().toggleOrderedList().run(),
                  editor.isActive("orderedList"),
                  <ListOrdered className="h-4 w-4" />
                )}
              </>
            )}
          </div>
          <EditorContent
            editor={editor}
            className="prose-rpg text-sm min-h-[200px] max-h-[500px] overflow-y-auto"
          />
        </div>
        {errors.content && <p className={errorClass}>{errors.content.message}</p>}
      </div>

      <ImageUpload
        value={image}
        onChange={(url) => setValue("image", url)}
        folder="posts"
        label="Imagem de Capa (opcional)"
        aspectRatio="wide"
      />

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
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-[var(--color-accent-purple)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-60 transition-colors"
        >
          {isSubmitting ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
