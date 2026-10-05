"use client";

import { type ReactNode, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
};

export function Reveal({
  children,
  className,
  stagger = 0.12,
  y = 40,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const root = ref.current;
        if (!root || root.children.length === 0) return;
        gsap.from(root.children, {
          autoAlpha: 0,
          y,
          duration: 1.1,
          ease: "power3.out",
          stagger,
          scrollTrigger: { trigger: root, start: "top 85%", once: true },
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
