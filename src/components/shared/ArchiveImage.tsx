"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { ArchiveMark } from "./ArchiveMark";

type ArchiveImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  variant?: "cover" | "portrait" | "artwork" | "banner";
};

export function ArchiveImage({
  src,
  alt,
  variant = "artwork",
  fill,
  className = "",
  onError,
  unoptimized,
  ...props
}: ArchiveImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const fingerprint =
    Array.from(alt).reduce((n, c) => (n * 33) ^ c.charCodeAt(0), 5381) >>> 0;
  const tone = ["forest", "wine", "slate"][fingerprint % 3];
  if (!src || failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={`${alt} — ilustração indisponível`}
        data-tone={tone}
        data-variant={variant}
        className={`archive-fallback ${fill ? "archive-fallback-fill" : "archive-fallback-inline"}`}
      >
        <div className="archive-fallback-frame" aria-hidden="true">
          <span className="archive-fallback-caption">
            Ex libris · Museu Digital
          </span>
          <div className="archive-fallback-emblem">
            <ArchiveMark />
          </div>
          <span className="archive-fallback-title">{alt}</span>
          <span className="archive-fallback-ornament">◆</span>
        </div>
      </div>
    );
  }
  return (
    <Image
      key={src}
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={
        fill
          ? "(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
          : undefined
      }
      // Google Drive images must use the configured Next.js loader: browsers
      // can block direct cross-origin requests with ERR_BLOCKED_BY_ORB.
      unoptimized={
        unoptimized ??
        (/^https?:\/\//.test(src) &&
          !/^https:\/\/lh3\.googleusercontent\.com\/d\//.test(src))
      }
      {...props}
      onError={(event) => {
        setFailedSrc(src);
        onError?.(event);
      }}
    />
  );
}
