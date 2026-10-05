import type { ReactNode } from "react";
import { Cursor } from "@/components/motion/Cursor";
import { Grain } from "@/components/motion/Grain";
import { Preloader } from "@/components/motion/Preloader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { FloatingTelegram } from "@/components/sections/FloatingTelegram";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <FloatingTelegram />
      <Cursor />
      <Grain />
    </>
  );
}
