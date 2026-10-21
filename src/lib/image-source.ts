export function resolveArchiveImageSrc(src?: string | null) {
  // The unsized Drive endpoint can return 429 even when its sized image works.
  if (src && /^https:\/\/lh3\.googleusercontent\.com\/d\/[\w-]+$/.test(src)) {
    return `${src}=w1600`;
  }
  return src;
}
