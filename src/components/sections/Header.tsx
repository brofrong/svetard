"use client";

import { useRef } from "react";
import { Wordmark } from "@/components/brand/Logo";
import { MessengerLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function Header() {
  const ref = useRef<HTMLElement>(null);
  const { header, nav } = site;

  useGSAP(() => {
    const element = ref.current;
    if (!element) return;
    let hidden = false;
    const setHidden = (next: boolean) => {
      if (next === hidden) return;
      hidden = next;
      gsap.to(element, {
        yPercent: next ? -100 : 0,
        duration: 0.45,
        ease: "power3.out",
      });
    };
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        element.dataset.scrolled = y > 40 ? "true" : "false";
        setHidden(y > 160 && self.direction === 1);
      },
    });
    // при фокусе с клавиатуры шапка всегда возвращается
    const reveal = () => setHidden(false);
    element.addEventListener("focusin", reveal);
    return () => element.removeEventListener("focusin", reveal);
  });

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500 data-[scrolled=true]:bg-ivory/85 data-[scrolled=true]:backdrop-blur-md"
    >
      <Container className="flex h-20 items-center justify-between gap-6">
        <a href="#top" aria-label={header.homeLabel} className="shrink-0">
          <Wordmark className="h-4 w-auto text-espresso" />
        </a>
        <nav aria-label={header.navLabel} className="hidden xl:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[11px] uppercase tracking-[0.2em] text-mocha transition-colors hover:text-espresso"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <MessengerLink
          channel="telegram"
          text={header.ctaMessage}
          variant="outline"
          size="sm"
        >
          {header.cta}
        </MessengerLink>
      </Container>
    </header>
  );
}
