import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialSlider } from "@/components/ui/TestimonialSlider";
import { site } from "@/content/site";

export function Results() {
  const { results } = site;
  return (
    <section id="results" className="overflow-hidden bg-sand py-20 lg:py-40">
      <Container className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeading eyebrow={results.eyebrow} title={results.title} />
          <div className="mt-12">
            <TestimonialSlider
              items={results.testimonials}
              prevLabel={results.prevLabel}
              nextLabel={results.nextLabel}
            />
          </div>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <BeforeAfter {...results.beforeAfter} />
        </div>
      </Container>
    </section>
  );
}
