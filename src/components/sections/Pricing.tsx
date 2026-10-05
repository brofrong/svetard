import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { MessengerLink, messengerHref } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";

export function Pricing() {
  const { pricing } = site;
  return (
    <section id="pricing" className="bg-sand py-20 lg:py-40">
      <Container>
        <SectionHeading
          eyebrow={pricing.eyebrow}
          title={pricing.title}
          align="center"
        />
        <Reveal
          className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-stretch"
          stagger={0.15}
        >
          {pricing.plans.map((plan) => (
            <article
              key={plan.id}
              {...(plan.featured ? { "data-featured": "" } : {})}
              className={cx(
                "relative flex flex-col rounded-t-[12rem] px-8 pt-24 pb-10 text-center lg:px-10",
                plan.featured
                  ? "bg-espresso text-ivory lg:-mt-6 lg:mb-6"
                  : "bg-ivory text-espresso",
              )}
            >
              {plan.featured ? (
                <span
                  aria-hidden="true"
                  className="gold-border pointer-events-none absolute inset-0 rounded-t-[12rem]"
                />
              ) : null}
              {plan.badge ? (
                <p className="eyebrow mb-4 text-gold-2">{plan.badge}</p>
              ) : null}
              <h3 className="font-serif text-4xl font-light">{plan.title}</h3>
              <p
                className={cx(
                  "eyebrow mt-3",
                  plan.featured ? "text-ivory/80" : "text-mocha",
                )}
              >
                {plan.period}
              </p>
              <p className="mt-8 font-serif text-5xl">{plan.price}</p>
              <ul
                className={cx(
                  "mt-10 space-y-3 text-left text-sm",
                  plan.featured ? "text-ivory/85" : "text-mocha",
                )}
              >
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <Check
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className={cx(
                        "mt-0.5 size-4 shrink-0",
                        plan.featured ? "text-gold-2" : "text-gold-3",
                      )}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col items-center gap-4 pt-10">
                <MessengerLink
                  channel="telegram"
                  text={plan.messengerText}
                  variant={plan.featured ? "light" : "primary"}
                >
                  {pricing.cta}
                </MessengerLink>
                <a
                  href={messengerHref("whatsapp", plan.messengerText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx(
                    "text-xs underline-offset-4 hover:underline",
                    plan.featured ? "text-ivory/80" : "text-mocha",
                  )}
                >
                  {pricing.whatsappCta}
                </a>
              </div>
            </article>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
