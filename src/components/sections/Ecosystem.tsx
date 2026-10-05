"use client";

import {
  CirclePlay,
  Dumbbell,
  Leaf,
  type LucideIcon,
  Sun,
  User,
  Users,
} from "lucide-react";
import { useRef } from "react";
import { Wordmark } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";
import type { EcosystemIcon } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

const ICONS: Record<EcosystemIcon, LucideIcon> = {
  user: User,
  leaf: Leaf,
  dumbbell: Dumbbell,
  users: Users,
  play: CirclePlay,
  sun: Sun,
};

const RADIUS = 42;

function polar(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: Number((50 + RADIUS * Math.cos(angle)).toFixed(3)),
    y: Number((50 + RADIUS * Math.sin(angle)).toFixed(3)),
  };
}

export function Ecosystem() {
  const ref = useRef<HTMLElement>(null);
  const { ecosystem, brand } = site;
  const nodes = ecosystem.nodes.map((node, index) => ({
    ...node,
    ...polar(index, ecosystem.nodes.length),
  }));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const root = ref.current;
        const diagram = root?.querySelector("[data-eco-diagram]");
        if (!root || !diagram) return;
        const trigger = { trigger: diagram, start: "top 75%", once: true };
        gsap.from(root.querySelectorAll("[data-eco-line]"), {
          drawSVG: 0,
          duration: 1.4,
          ease: "power2.inOut",
          stagger: 0.08,
          scrollTrigger: { ...trigger },
        });
        gsap.from(root.querySelectorAll("[data-eco-node]"), {
          autoAlpha: 0,
          scale: 0.6,
          duration: 0.8,
          ease: "back.out(1.6)",
          stagger: 0.1,
          delay: 0.4,
          scrollTrigger: { ...trigger },
        });
        gsap.to(root.querySelector("[data-eco-orbit]"), {
          rotation: 360,
          duration: 90,
          ease: "none",
          repeat: -1,
        });
        gsap.to(root.querySelectorAll("[data-eco-node]"), {
          rotation: -360,
          duration: 90,
          ease: "none",
          repeat: -1,
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="overflow-hidden py-20 lg:py-40">
      <Container className="grid items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={ecosystem.eyebrow} title={ecosystem.title} />
          <p className="mt-8 max-w-md text-lg leading-relaxed text-mocha">
            {ecosystem.text}
          </p>
        </div>
        <div
          data-eco-diagram
          className="relative mx-auto aspect-square w-full max-w-[36rem] lg:col-span-6 lg:col-start-7"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="absolute inset-0 size-full"
            fill="none"
            stroke="var(--color-gold-3)"
            strokeWidth={1}
          >
            <circle
              data-eco-line
              cx="50"
              cy="50"
              r={RADIUS}
              strokeOpacity={0.6}
              vectorEffect="non-scaling-stroke"
            />
            <circle
              data-eco-line
              cx="50"
              cy="50"
              r="17"
              strokeOpacity={0.4}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div data-eco-orbit className="absolute inset-0">
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              className="absolute inset-0 size-full"
              fill="none"
              stroke="var(--color-gold-3)"
              strokeWidth={1}
              strokeOpacity={0.35}
            >
              {nodes.map((node) => (
                <line
                  key={node.label}
                  data-eco-line
                  x1="50"
                  y1="50"
                  x2={node.x}
                  y2={node.y}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
            <ul>
              {nodes.map((node) => {
                const Icon = ICONS[node.icon];
                return (
                  <li
                    key={node.label}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    <div
                      data-eco-node
                      className="flex w-24 flex-col items-center gap-2 sm:w-32"
                    >
                      <span className="grid size-11 place-items-center rounded-full border border-gold-3/60 bg-ivory sm:size-14">
                        <Icon
                          aria-hidden="true"
                          strokeWidth={1.25}
                          className="size-5 text-gold-3"
                        />
                      </span>
                      <span className="text-center text-[10px] leading-snug uppercase tracking-[0.15em] text-mocha sm:text-[11px]">
                        {node.label}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-3">
              <Wordmark className="h-4 w-auto text-espresso sm:h-6" />
              <p className="hidden text-[10px] uppercase tracking-[0.3em] text-mocha sm:block">
                {brand.tagline}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
