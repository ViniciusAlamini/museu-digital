import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveArchiveImageSrc } from "../src/lib/image-source.ts";

test("requests a bounded Google image for the artwork that returned HTTP 429", () => {
  const src = "https://lh3.googleusercontent.com/d/1iIgmDHROZRpQrdWCgknNqyWcxPB3M2JL";
  assert.equal(resolveArchiveImageSrc(src), `${src}=w1600`);
});

test("preserves uploads, other providers, and Google images with an existing size", () => {
  for (const src of [
    "/uploads/artworks/drawing.jpg",
    "https://example.com/drawing.jpg",
    "https://lh3.googleusercontent.com/d/file-id=w800",
    "https://lh3.googleusercontent.com/d/file-id?custom=value",
    "https://lh3.googleusercontent.com.example.com/d/file-id",
    "",
    null,
    undefined,
  ]) {
    assert.equal(resolveArchiveImageSrc(src), src);
  }
});
