import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

export function Pains() {
  const { pains } = site;
  return (
    <section className="bg-sand py-20 lg:py-32">
      <Container>
        <SectionHeading eyebrow={pains.eyebrow} title={pains.title} />
        <Reveal
          className="mt-14 grid gap-px bg-taupe/30 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {pains.items.map((pain) => (
            <article
              key={pain.title}
              className="group relative overflow-hidden bg-sand p-8 lg:p-10"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-gold-2/30 to-transparent transition-transform duration-1000 ease-silk group-hover:translate-x-full"
              />
              <h3 className="relative font-serif text-2xl text-espresso lg:text-3xl">
                {pain.title}
              </h3>
              <p className="relative mt-3 leading-relaxed text-mocha">
                {pain.text}
              </p>
            </article>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
