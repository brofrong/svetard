"use client";

import { type ReactNode, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_FINE } from "@/lib/motion";

export function Magnetic({
  children,
  strength = 0.3,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_FINE, () => {
        const element = ref.current;
        if (!element) return;
        const xTo = gsap.quickTo(element, "x", {
          duration: 0.6,
          ease: "power3.out",
        });
        const yTo = gsap.quickTo(element, "y", {
          duration: 0.6,
          ease: "power3.out",
        });
        const move = (event: PointerEvent) => {
          const rect = element.getBoundingClientRect();
          xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
          yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        element.addEventListener("pointermove", move);
        element.addEventListener("pointerleave", leave);
        return () => {
          element.removeEventListener("pointermove", move);
          element.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="inline-block">
      {children}
    </div>
  );
}
