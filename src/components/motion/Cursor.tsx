"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_FINE } from "@/lib/motion";

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_FINE, () => {
      const ring = ref.current;
      if (!ring) return;
      gsap.set(ring, { xPercent: -50, yPercent: -50 });
      const xTo = gsap.quickTo(ring, "x", {
        duration: 0.35,
        ease: "power3.out",
      });
      const yTo = gsap.quickTo(ring, "y", {
        duration: 0.35,
        ease: "power3.out",
      });
      let active = false;
      const move = (event: PointerEvent) => {
        gsap.set(ring, { autoAlpha: 1 });
        xTo(event.clientX);
        yTo(event.clientY);
        const target = event.target instanceof Element ? event.target : null;
        const interactive = Boolean(
          target?.closest("a, button, input, [data-cursor]"),
        );
        if (interactive !== active) {
          active = interactive;
          gsap.to(ring, { scale: interactive ? 2.2 : 1, duration: 0.3 });
        }
      };
      window.addEventListener("pointermove", move);
      return () => {
        window.removeEventListener("pointermove", move);
        gsap.set(ring, { autoAlpha: 0 });
      };
    });
  });
  return (
    <div
      ref={ref}
      data-cursor-ring
      aria-hidden="true"
      className="pointer-events-none invisible fixed top-0 left-0 z-[90] size-8 rounded-full border border-gold-1"
    />
  );
}
