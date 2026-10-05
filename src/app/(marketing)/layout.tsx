import type { ReactNode } from "react";
import { Preloader } from "@/components/motion/Preloader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
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
    </>
  );
}
