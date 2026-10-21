"use client";

import { useEffect, useRef } from "react";

function markUnavailable(image: HTMLImageElement) {
  if (image.hidden) return;
  image.hidden = true;
  const note = document.createElement("span");
  note.className = "rich-image-unavailable";
  note.setAttribute("role", "img");
  note.setAttribute("aria-label", image.alt || "Ilustração indisponível");
  note.textContent = image.alt
    ? `Ilustração: ${image.alt} · indisponível`
    : "Ilustração indisponível no acervo";
  image.after(note);
}

export function RichContent({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    contentRef.current?.querySelectorAll("img").forEach((image) => {
      if (image.complete && image.naturalWidth === 0) markUnavailable(image);
    });
  }, [html]);
  return (
    <div
      ref={contentRef}
      className={`prose-rpg ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
      onErrorCapture={(event) => {
        const image = event.target;
        if (image instanceof HTMLImageElement) markUnavailable(image);
      }}
    />
  );
}
