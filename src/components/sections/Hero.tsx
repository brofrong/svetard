"use client";

import { useRef } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { SilkHero } from "@/components/three/SilkHero";
import { AccentText } from "@/components/ui/AccentText";
import { ButtonLink, MessengerLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { MOTION_OK } from "@/lib/motion";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { hero, brand } = site;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const root = ref.current;
        const title = root?.querySelector("h1");
        if (!root || !title) return;
        const split = SplitText.create(title, { type: "lines", mask: "lines" });
        const fades = root.querySelectorAll("[data-hero-fade]");
        gsap.set(split.lines, { yPercent: 110 });
        gsap.set(fades, { autoAlpha: 0, y: 24 });
        return onIntroDone(() => {
          gsap
            .timeline()
            .to(split.lines, {
              yPercent: 0,
              duration: 1.3,
              ease: "expo.out",
              stagger: 0.12,
            })
            .to(
              fades,
              {
                autoAlpha: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                stagger: 0.1,
              },
              "-=0.9",
            );
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate flex min-h-svh items-end overflow-hidden pt-32 pb-20 lg:items-center lg:pb-0"
    >
      <SilkHero image={hero.image} />
      <Container>
        <div className="max-w-4xl">
          <p data-hero-fade className="eyebrow text-mocha">
            {hero.eyebrow}
          </p>
          <h1 className="mt-6 font-serif text-[clamp(3rem,8vw,7.5rem)] font-light leading-[0.95] text-espresso">
            <AccentText text={hero.title} />
          </h1>
          <p
            data-hero-fade
            className="mt-8 max-w-xl text-lg leading-relaxed text-mocha"
          >
            {hero.subtitle}
          </p>
          <div data-hero-fade className="mt-10 flex flex-wrap gap-4">
            <Magnetic>
              <ButtonLink href="#pricing">{hero.primaryCta}</ButtonLink>
            </Magnetic>
            <Magnetic>
              <MessengerLink
                channel="telegram"
                text={hero.messengerText}
                variant="outline"
              >
                {hero.secondaryCta}
              </MessengerLink>
            </Magnetic>
          </div>
          <p data-hero-fade className="eyebrow mt-16 text-mocha">
            {brand.tagline}
          </p>
        </div>
      </Container>
    </section>
  );
}
