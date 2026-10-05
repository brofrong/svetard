import { Marquee } from "@/components/motion/Marquee";
import { About } from "@/components/sections/About";
import { Hero } from "@/components/sections/Hero";
import { Pains } from "@/components/sections/Pains";
import { Path } from "@/components/sections/Path";
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
    </>
  );
}
