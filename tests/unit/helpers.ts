import type { ImageRef } from "@/content/types";

export function collectImages(
  value: unknown,
  out: ImageRef[] = [],
): ImageRef[] {
  if (Array.isArray(value)) {
    for (const item of value) collectImages(item, out);
  } else if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.src === "string" && typeof record.alt === "string") {
      out.push({ src: record.src, alt: record.alt });
    } else {
      for (const item of Object.values(record)) collectImages(item, out);
    }
  }
  return out;
}
