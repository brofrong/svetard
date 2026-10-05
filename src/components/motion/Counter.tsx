"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

export function Counter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const element = ref.current;
        if (!element) return;
        const state = { n: 0 };
        const render = () => {
          element.textContent = `${Math.round(state.n)}${suffix}`;
        };
        render();
        gsap.to(state, {
          n: value,
          duration: 2,
          ease: "power2.out",
          onUpdate: render,
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
        });
        return () => {
          element.textContent = `${value}${suffix}`;
        };
      });
    },
    { scope: ref },
  );
  return (
    <span ref={ref} suppressHydrationWarning>
      {value}
      {suffix}
    </span>
  );
}
