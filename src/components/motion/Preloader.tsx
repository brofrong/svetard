"use client";

import { useRef } from "react";
import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { gsap, useGSAP } from "@/lib/gsap";
import { INTRO_STORAGE_KEY, markIntroDone } from "@/lib/intro";

export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      if (document.documentElement.dataset.intro === "skip") {
        markIntroDone();
        return;
      }
      root.style.animation = "none";
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {
        // приватный режим без sessionStorage: прелоадер просто покажется снова
      }
      gsap
        .timeline({
          onComplete: () => {
            root.style.display = "none";
            markIntroDone();
          },
        })
        .from(root.querySelectorAll("[data-mark] [data-draw]"), {
          drawSVG: 0,
          duration: 1.3,
          ease: "power2.inOut",
          stagger: 0.15,
        })
        .from(
          root.querySelector("[data-mark] [data-dot]"),
          { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%", duration: 0.4 },
          "-=0.5",
        )
        .from(
          root.querySelectorAll("[data-wordmark] [data-draw]"),
          { drawSVG: 0, duration: 0.8, ease: "power2.out", stagger: 0.06 },
          "-=0.6",
        )
        .to(
          root,
          { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
          "+=0.25",
        );
    },
    { scope: ref },
  );
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="preloader fixed inset-0 z-[100] grid place-items-center bg-ivory"
    >
      <div className="flex flex-col items-center gap-8">
        <LogoMark className="h-28 w-auto" />
        <Wordmark className="h-5 w-auto text-espresso" />
      </div>
    </div>
  );
}
