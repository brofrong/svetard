"use client";

import { Send } from "lucide-react";
import { useRef } from "react";
import { messengerHref } from "@/components/ui/Button";
import { site } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function FloatingTelegram() {
  const ref = useRef<HTMLAnchorElement>(null);
  useGSAP(() => {
    const button = ref.current;
    if (!button) return;
    gsap.set(button, { autoAlpha: 0, y: 16 });
    ScrollTrigger.create({
      trigger: "#top",
      start: "bottom 70%",
      onEnter: () =>
        gsap.to(button, {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        }),
      onLeaveBack: () =>
        gsap.to(button, { autoAlpha: 0, y: 16, duration: 0.3 }),
    });
  });
  return (
    <a
      ref={ref}
      data-floating-telegram
      href={messengerHref("telegram", site.header.ctaMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={site.footer.floatingLabel}
      className="invisible fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-espresso text-gold-2 shadow-lg lg:hidden"
    >
      <Send aria-hidden="true" strokeWidth={1.5} className="size-5" />
    </a>
  );
}
