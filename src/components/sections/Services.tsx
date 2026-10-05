import { Reveal } from "@/components/motion/Reveal";
import { ArchImage } from "@/components/ui/ArchImage";
import { MessengerLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

export function Services() {
  const { services } = site;
  return (
    <section id="services" className="py-20 lg:py-40">
      <Container>
        <SectionHeading eyebrow={services.eyebrow} title={services.title} />
        <Reveal
          className="mt-16 grid gap-14 md:grid-cols-3 md:gap-8 lg:gap-12"
          stagger={0.15}
        >
          {services.items.map((service) => (
            <article key={service.id} className="group flex flex-col">
              <ArchImage
                image={service.image}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-[3/4]"
                imgClassName="transition-transform duration-[1600ms] ease-silk group-hover:scale-110"
              />
              <p className="eyebrow mt-8 text-mocha">{service.format}</p>
              <h3 className="mt-3 font-serif text-3xl text-espresso">
                {service.title}
              </h3>
              <p className="mt-4 leading-relaxed text-mocha">{service.text}</p>
              <ul className="mt-6 space-y-2 text-sm text-mocha">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-px w-4 shrink-0 bg-gold-3"
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <MessengerLink
                  channel="telegram"
                  text={service.messengerText}
                  variant="outline"
                >
                  {services.cta}
                </MessengerLink>
              </div>
            </article>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
