"use client";

import { type ReactNode, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

export function LogoDraw({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const root = ref.current;
        if (!root) return;
        gsap.from(root.querySelectorAll("[data-draw]"), {
          drawSVG: 0,
          duration: 2,
          ease: "power2.inOut",
          stagger: 0.1,
          scrollTrigger: { trigger: root, start: "top 95%", once: true },
        });
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
