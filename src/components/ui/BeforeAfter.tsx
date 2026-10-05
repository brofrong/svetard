"use client";

import Image from "next/image";
import { useState } from "react";
import type { BeforeAfterContent } from "@/content/types";

export function BeforeAfter({
  before,
  after,
  beforeLabel,
  afterLabel,
  caption,
  sliderLabel,
}: BeforeAfterContent) {
  const [position, setPosition] = useState(50);
  return (
    <figure>
      <div className="relative aspect-[4/5] select-none overflow-hidden rounded-t-full">
        <Image
          src={after.src}
          alt={after.alt}
          fill
          sizes="(min-width: 1024px) 30vw, 100vw"
          className="object-cover"
        />
        <div
          data-before
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={before.src}
            alt={before.alt}
            fill
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px bg-ivory"
          style={{ left: `${position}%` }}
        >
          <span className="absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ivory bg-espresso/40 text-ivory backdrop-blur">
            ↔
          </span>
        </div>
        <span className="eyebrow absolute bottom-6 left-6 rounded-full bg-espresso/60 px-3 py-1 text-ivory">
          {beforeLabel}
        </span>
        <span className="eyebrow absolute right-6 bottom-6 rounded-full bg-espresso/60 px-3 py-1 text-ivory">
          {afterLabel}
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label={sliderLabel}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-4 text-sm text-mocha">{caption}</figcaption>
    </figure>
  );
}
