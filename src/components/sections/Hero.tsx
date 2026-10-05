import Image from "next/image";
import { AccentText } from "@/components/ui/AccentText";
import { ButtonLink, MessengerLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";

export function Hero() {
  const { hero, brand } = site;
  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh items-end overflow-hidden pt-32 pb-20 lg:items-center lg:pb-0"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image
          src={hero.image.src}
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ivory via-ivory/20 to-transparent" />
      </div>
      <Container>
        <div className="max-w-4xl">
          <p data-hero-fade className="eyebrow text-mocha">
            {hero.eyebrow}
          </p>
          <h1 className="mt-6 font-serif text-[clamp(3rem,8vw,7.5rem)] font-light leading-[0.95] text-espresso">
            <AccentText text={hero.title} />
          </h1>
          <p
            data-hero-fade
            className="mt-8 max-w-xl text-lg leading-relaxed text-mocha"
          >
            {hero.subtitle}
          </p>
          <div data-hero-fade className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="#pricing">{hero.primaryCta}</ButtonLink>
            <MessengerLink
              channel="telegram"
              text={hero.messengerText}
              variant="outline"
            >
              {hero.secondaryCta}
            </MessengerLink>
          </div>
          <p data-hero-fade className="eyebrow mt-16 text-mocha">
            {brand.tagline}
          </p>
        </div>
      </Container>
    </section>
  );
}
