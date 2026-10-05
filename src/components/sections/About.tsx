import { ArchReveal } from "@/components/motion/ArchReveal";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { ArchImage } from "@/components/ui/ArchImage";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

export function About() {
  const { about } = site;
  return (
    <section id="about" className="py-20 lg:py-40">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <ArchReveal className="lg:col-span-5">
          <ArchImage
            image={about.image}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[3/4]"
          />
        </ArchReveal>
        <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
          <SectionHeading eyebrow={about.eyebrow} title={about.title} />
          <Reveal className="mt-8 space-y-5 text-lg leading-relaxed text-mocha">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
          <Reveal className="mt-10 flex flex-wrap gap-3" stagger={0.06} y={16}>
            {about.credentials.map((credential) => (
              <span
                key={credential}
                className="rounded-full border border-taupe/50 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-mocha"
              >
                {credential}
              </span>
            ))}
          </Reveal>
          <dl className="mt-14 grid grid-cols-2 gap-8 border-t border-taupe/40 pt-10 sm:grid-cols-4">
            {about.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-2">
                <dt className="text-xs uppercase tracking-[0.2em] text-mocha">
                  {stat.label}
                </dt>
                <dd className="font-serif text-5xl font-light text-espresso">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
