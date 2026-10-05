import { useId } from "react";

const GLYPHS = [
  {
    id: "s",
    d: "M56 18C50 6 40 2 30 2C14 2 4 12 4 25C4 40 18 46 30 50C44 54 56 60 56 75C56 89 44 98 30 98C18 98 8 92 4 82",
  },
  { id: "v", d: "M100 2L130 98L160 2" },
  { id: "e", d: "M256 2H204V98H256M204 50H248" },
  { id: "t", d: "M300 2H360M330 2V98" },
  { id: "a1", d: "M400 98L430 2L460 98" },
  {
    id: "r",
    d: "M504 98V2H532C548 2 558 12 558 27C558 42 548 52 532 52H504M530 52L558 98",
  },
  { id: "a2", d: "M600 98L630 2L660 98" },
] as const;

type LogoProps = { className?: string; title?: string };

export function Wordmark({ className, title = "SVETARA" }: LogoProps) {
  return (
    <svg
      data-wordmark
      viewBox="-4 -4 668 108"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>{title}</title>
      {GLYPHS.map((glyph) => (
        <path
          key={glyph.id}
          data-draw
          d={glyph.d}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

export function LogoMark({ className, title = "SVETARA" }: LogoProps) {
  const gradientId = `gold-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const gold = `url(#${gradientId})`;
  return (
    <svg
      data-mark
      viewBox="0 0 100 120"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#B8893F" />
          <stop offset="0.5" stopColor="#E8C98A" />
          <stop offset="1" stopColor="#A67C3A" />
        </linearGradient>
      </defs>
      <g stroke={gold} strokeWidth={1.5} strokeLinecap="round">
        <circle
          data-draw
          cx="50"
          cy="68"
          r="46"
          vectorEffect="non-scaling-stroke"
        />
        <path
          data-draw
          d="M50 14C72 26 72 46 50 58S28 92 50 108"
          vectorEffect="non-scaling-stroke"
        />
        <path
          data-draw
          d="M46 20C64 30 66 46 48 56S30 90 50 108"
          vectorEffect="non-scaling-stroke"
        />
      </g>
      <circle data-dot cx="50" cy="6" r="2.5" fill={gold} />
    </svg>
  );
}
