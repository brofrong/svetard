import { Marquee } from "@/components/motion/Marquee";
import { About } from "@/components/sections/About";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Pains } from "@/components/sections/Pains";
import { Path } from "@/components/sections/Path";
import { Pricing } from "@/components/sections/Pricing";
import { Program } from "@/components/sections/Program";
import { Results } from "@/components/sections/Results";
import { Services } from "@/components/sections/Services";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee items={site.marquee} />
      <About />
      <Pains />
      <Path />
      <Services />
      <Program />
      <Results />
      <Pricing />
      <Ecosystem />
      <Faq />
      <FinalCta />
    </>
  );
}
