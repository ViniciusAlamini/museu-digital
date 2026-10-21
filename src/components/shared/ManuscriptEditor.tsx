"use client";

import { useRef, useState } from "react";
import { EditorContent, ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import { ManuscriptImage } from "./ManuscriptImage";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import ImageExtension from "@tiptap/extension-image";

const DiaryImage = ImageExtension.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ManuscriptImage);
  },
});
import {
  Bold,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
} from "lucide-react";

export function ManuscriptEditor({
  id,
  value,
  onChange,
  error,
  diary = false,
  onUploadChange,
}: {
  id: string;
  value: string;
  onChange: (html: string) => void;
  error?: string;
  diary?: boolean;
  onUploadChange?: (uploading: boolean) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit,
      ...(diary ? [DiaryImage] : []),
      Placeholder.configure({
        placeholder: diary
          ? "Escreva o diário aqui…"
          : "Escreva o conteúdo do post…",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        id,
        role: "textbox",
        "aria-multiline": "true",
        "aria-labelledby": `${id}-label`,
        "aria-required": "true",
        "aria-invalid": error ? "true" : "false",
        ...(error ? { "aria-describedby": `${id}-error` } : {}),
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
    onCreate: ({ editor }) => {
      if (editor.isEmpty && value) onChange("");
    },
  });

  async function upload(file: File) {
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      setUploadError("Selecione uma imagem de até 10 MB.");
      return;
    }
    setUploading(true);
    onUploadChange?.(true);
    setUploadError("");
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "posts");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error("Upload failed");
      editor?.chain().focus().setImage({ src: result.url }).run();
    } catch {
      setUploadError("Não foi possível enviar a imagem. Tente novamente.");
    } finally {
      setUploading(false);
      onUploadChange?.(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const tool = (
    label: string,
    active: boolean,
    run: () => void,
    icon: React.ReactNode,
    disabled = false,
  ) => (
    <button
      key={label}
      type="button"
      className="editor-tool"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled || !editor}
      onClick={run}
    >
      {icon}
    </button>
  );

  return (
    <div>
      <label
        id={`${id}-label`}
        htmlFor={id}
        className="field-label"
        onClick={() => editor?.commands.focus()}
      >
        Conteúdo *
      </label>
      <div className="manuscript-editor">
        <div
          className="editor-toolbar"
          role="group"
          aria-label="Formatação do conteúdo"
        >
          {tool(
            "Título nível 2",
            editor?.isActive("heading", { level: 2 }) ?? false,
            () => {
              editor?.chain().focus().toggleHeading({ level: 2 }).run();
            },
            <Heading2 size={18} />,
          )}
          {tool(
            "Título nível 3",
            editor?.isActive("heading", { level: 3 }) ?? false,
            () => {
              editor?.chain().focus().toggleHeading({ level: 3 }).run();
            },
            <Heading3 size={18} />,
          )}
          <span className="editor-divider" aria-hidden="true" />
          {tool(
            "Negrito",
            editor?.isActive("bold") ?? false,
            () => {
              editor?.chain().focus().toggleBold().run();
            },
            <Bold size={18} />,
          )}
          {tool(
            "Itálico",
            editor?.isActive("italic") ?? false,
            () => {
              editor?.chain().focus().toggleItalic().run();
            },
            <Italic size={18} />,
          )}
          <span className="editor-divider" aria-hidden="true" />
          {tool(
            "Lista com marcadores",
            editor?.isActive("bulletList") ?? false,
            () => {
              editor?.chain().focus().toggleBulletList().run();
            },
            <List size={18} />,
          )}
          {tool(
            "Lista numerada",
            editor?.isActive("orderedList") ?? false,
            () => {
              editor?.chain().focus().toggleOrderedList().run();
            },
            <ListOrdered size={18} />,
          )}
          {diary && (
            <>
              <span className="editor-divider" aria-hidden="true" />
              {tool(
                "Citação",
                editor?.isActive("blockquote") ?? false,
                () => {
                  editor?.chain().focus().toggleBlockquote().run();
                },
                <Quote size={18} />,
              )}
              {tool(
                "Linha divisória",
                false,
                () => {
                  editor?.chain().focus().setHorizontalRule().run();
                },
                <Minus size={18} />,
              )}
              <button
                type="button"
                className="editor-tool"
                aria-label="Inserir imagem"
                title="Inserir imagem"
                disabled={uploading || !editor}
                onClick={() => fileRef.current?.click()}
              >
                <ImageIcon size={18} />
              </button>
            </>
          )}
        </div>
        <EditorContent editor={editor} className="editor-content" />
      </div>
      {diary && (
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          aria-label="Imagem para o diário"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
      <div aria-live="polite">
        {uploading && <p className="form-help">Enviando imagem…</p>}
        {uploadError && (
          <p className="field-error" role="alert">
            {uploadError}
          </p>
        )}
      </div>
    </div>
  );
}
