import { splitAccent } from "@/lib/accent";
import { cx } from "@/lib/cx";

type AccentTextProps = { text: string; tone?: "light" | "dark" };

export function AccentText({ text, tone = "light" }: AccentTextProps) {
  return splitAccent(text).map((part) =>
    part.accent ? (
      <em
        key={`a:${part.text}`}
        className={cx(
          "font-normal italic",
          tone === "dark" ? "text-gold-2" : "text-gold-3",
        )}
      >
        {part.text}
      </em>
    ) : (
      <span key={`t:${part.text}`}>{part.text}</span>
    ),
  );
}
