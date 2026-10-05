"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

export function Marquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const track = ref.current?.querySelector<HTMLElement>("[data-track]");
        if (!track) return;
        const loop = gsap.to(track, {
          xPercent: -50,
          ease: "none",
          duration: 40,
          repeat: -1,
        });
        ScrollTrigger.create({
          onUpdate: (self) => {
            const boost = Math.min(Math.abs(self.getVelocity()) / 400, 4);
            gsap.to(loop, {
              timeScale: 1 + boost,
              duration: 0.2,
              overwrite: true,
              onComplete: () => {
                gsap.to(loop, { timeScale: 1, duration: 1 });
              },
            });
          },
        });
      });
    },
    { scope: ref },
  );
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="overflow-hidden border-y border-taupe/30 py-6"
    >
      <div data-track className="flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {items.map((item) => (
              <li
                key={item}
                className="flex items-center font-serif text-3xl font-light italic text-espresso lg:text-5xl"
              >
                <span className="px-8">{item}</span>
                <span className="text-gold-3 not-italic">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
