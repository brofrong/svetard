import { MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { MessengerLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";

export function FinalCta() {
  const { cta } = site;
  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden bg-espresso py-28 text-ivory lg:py-48"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 mx-auto h-[85%] w-[min(90vw,56rem)] overflow-hidden rounded-t-full opacity-60"
      >
        <Image
          src={cta.image.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 56rem, 90vw"
          className="warm-photo object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-espresso via-espresso/40 to-transparent" />
      </div>
      <Container className="text-center">
        <p className="eyebrow text-gold-2">{cta.eyebrow}</p>
        <SplitHeading
          as="h2"
          by="chars"
          tone="dark"
          text={cta.title}
          className="mt-6 font-serif text-[clamp(3rem,9vw,8rem)] font-light leading-none"
        />
        <p className="mx-auto mt-8 max-w-xl text-lg text-ivory/85">
          {cta.text}
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Magnetic>
            <MessengerLink
              channel="telegram"
              text={cta.messengerText}
              variant="light"
            >
              <Send aria-hidden="true" strokeWidth={1.5} className="size-4" />
              {cta.telegram}
            </MessengerLink>
          </Magnetic>
          <Magnetic>
            <MessengerLink
              channel="whatsapp"
              text={cta.messengerText}
              variant="light"
            >
              <MessageCircle
                aria-hidden="true"
                strokeWidth={1.5}
                className="size-4"
              />
              {cta.whatsapp}
            </MessengerLink>
          </Magnetic>
        </div>
      </Container>
    </section>
  );
}
