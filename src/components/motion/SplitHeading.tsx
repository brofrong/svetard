"use client";

import { useRef } from "react";
import { AccentText } from "@/components/ui/AccentText";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

type SplitHeadingProps = {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  tone?: "light" | "dark";
  by?: "lines" | "chars";
};

export function SplitHeading({
  text,
  as: Tag = "h2",
  className,
  tone = "light",
  by = "lines",
}: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const element = ref.current;
        if (!element) return;
        const byChars = by === "chars";
        SplitText.create(element, {
          type: byChars ? "words,chars" : "lines",
          mask: byChars ? "words" : "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(byChars ? self.chars : self.lines, {
              yPercent: 110,
              duration: byChars ? 0.9 : 1.2,
              ease: "expo.out",
              stagger: byChars ? 0.03 : 0.1,
              scrollTrigger: { trigger: element, start: "top 85%", once: true },
            }),
        });
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      <AccentText text={text} tone={tone} />
    </Tag>
  );
}
