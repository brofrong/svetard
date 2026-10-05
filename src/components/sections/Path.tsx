"use client";

import { useRef } from "react";
import { ArchImage } from "@/components/ui/ArchImage";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

export function Path() {
  const ref = useRef<HTMLElement>(null);
  const { path } = site;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const section = ref.current;
        const track = section?.querySelector<HTMLElement>("[data-path-track]");
        const progress = section?.querySelector<HTMLElement>(
          "[data-path-progress]",
        );
        if (!section || !track) return;
        section.setAttribute("data-horizontal", "");
        const distance = () =>
          Math.max(0, track.scrollWidth - window.innerWidth);
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        timeline.to(track, { x: () => -distance(), ease: "none" }, 0);
        if (progress)
          timeline.fromTo(
            progress,
            { scaleX: 0 },
            { scaleX: 1, ease: "none" },
            0,
          );
        return () => section.removeAttribute("data-horizontal");
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="path"
      className="group/path relative overflow-hidden bg-espresso py-20 text-ivory lg:py-24 data-[horizontal]:flex data-[horizontal]:min-h-svh data-[horizontal]:flex-col data-[horizontal]:justify-center data-[horizontal]:py-12"
    >
      <Container>
        <SectionHeading eyebrow={path.eyebrow} title={path.title} tone="dark" />
      </Container>
      <div
        data-path-track
        className="mt-12 grid gap-6 px-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:px-12 group-data-[horizontal]/path:flex group-data-[horizontal]/path:w-max"
      >
        {path.items.map((step, index) => (
          <article
            key={step.key}
            className="relative aspect-[3/4] overflow-hidden rounded-t-full group-data-[horizontal]/path:h-[52svh] group-data-[horizontal]/path:min-h-[22rem] group-data-[horizontal]/path:shrink-0"
          >
            <div className="absolute inset-0">
              <ArchImage
                image={step.image}
                sizes="(min-width: 1024px) 30vw, 70vw"
                shape="none"
                className="size-full"
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-espresso via-espresso/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
              <p className="font-serif text-2xl text-gold-2">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-serif text-3xl font-light">
                {step.title}
              </h3>
              <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-gold-2">
                {step.keywords.join(" · ")}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ivory/85">
                {step.text}
              </p>
            </div>
          </article>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="mx-6 mt-10 hidden h-px bg-ivory/15 group-data-[horizontal]/path:block lg:mx-12"
      >
        <div data-path-progress className="bg-gold h-px origin-left" />
      </div>
    </section>
  );
}
