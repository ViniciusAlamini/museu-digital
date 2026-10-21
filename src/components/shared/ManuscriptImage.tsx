"use client";

import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import { ArchiveImage } from "./ArchiveImage";

export function ManuscriptImage({ node }: ReactNodeViewProps) {
  const image = node.attrs as {
    src: string;
    alt?: string;
    title?: string;
    width?: number | string;
    height?: number | string;
  };
  return (
    <NodeViewWrapper
      className="editor-image-frame"
      contentEditable={false}
      data-drag-handle=""
    >
      <ArchiveImage
        src={image.src}
        alt={image.alt || "Ilustração do diário"}
        title={image.title}
        width={Number(image.width) > 0 ? Number(image.width) : 1200}
        height={Number(image.height) > 0 ? Number(image.height) : 900}
        className="w-full h-auto"
      />
    </NodeViewWrapper>
  );
}
