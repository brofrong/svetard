export type AccentPart = { text: string; accent: boolean };

const ACCENT = /(\*[^*]+\*)/;

export function splitAccent(input: string): AccentPart[] {
  return input
    .split(ACCENT)
    .filter(Boolean)
    .map((part) =>
      part.length > 2 && part.startsWith("*") && part.endsWith("*")
        ? { text: part.slice(1, -1), accent: true }
        : { text: part, accent: false },
    );
}
