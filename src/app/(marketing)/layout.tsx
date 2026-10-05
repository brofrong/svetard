import type { ReactNode } from "react";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
