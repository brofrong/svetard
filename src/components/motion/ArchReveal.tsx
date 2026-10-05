"use client";

import { type ReactNode, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

export function ArchReveal({
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
        gsap.fromTo(
          root,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            ease: "expo.out",
            scrollTrigger: { trigger: root, start: "top 80%", once: true },
          },
        );
        const media = root.querySelector("img");
        if (media) {
          gsap.fromTo(
            media,
            { scale: 1.25, yPercent: -6 },
            {
              scale: 1.1,
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
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
