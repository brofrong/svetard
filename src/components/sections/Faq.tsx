import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

export function Faq() {
  const { faq } = site;
  const items = faq.items.map((item) => ({
    id: item.id,
    title: item.question,
    content: <p>{item.answer}</p>,
  }));
  return (
    <section id="faq" className="bg-sand py-20 lg:py-32">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow={faq.eyebrow} title={faq.title} />
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <Accordion items={items} />
        </div>
      </Container>
    </section>
  );
}
