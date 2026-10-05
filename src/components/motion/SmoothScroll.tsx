"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

export function SmoothScroll() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const lenis = new Lenis({ autoRaf: false, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });
    return () => mm.revert();
  }, []);
  return null;
}
