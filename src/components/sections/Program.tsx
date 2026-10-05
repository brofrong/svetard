import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

export function Program() {
  const { program } = site;
  const items = program.modules.map((module, index) => ({
    id: module.id,
    meta: String(index + 1).padStart(2, "0"),
    title: module.title,
    content: (
      <ul className="space-y-2">
        {module.points.map((point) => (
          <li key={point}>— {point}</li>
        ))}
      </ul>
    ),
  }));
  return (
    <section id="program" className="py-20 lg:py-40">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <SectionHeading eyebrow={program.eyebrow} title={program.title} />
          <p className="eyebrow mt-8 text-mocha">{program.subtitle}</p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <Accordion items={items} defaultOpenId={program.modules[0]?.id} />
        </div>
      </Container>
    </section>
  );
}
