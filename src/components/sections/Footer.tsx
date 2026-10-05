import { Wordmark } from "@/components/brand/Logo";
import { LogoDraw } from "@/components/motion/LogoDraw";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";
import { telegramLink, whatsappLink } from "@/lib/messenger";

const externalProps = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Footer() {
  const { footer, contacts, brand } = site;
  const links = [
    {
      label: footer.links.telegram,
      href: telegramLink(contacts.telegram),
      external: true,
    },
    {
      label: footer.links.whatsapp,
      href: whatsappLink(contacts.whatsapp),
      external: true,
    },
    { label: footer.links.instagram, href: contacts.instagram, external: true },
    {
      label: contacts.email,
      href: `mailto:${contacts.email}`,
      external: false,
    },
  ];
  return (
    <footer className="border-t border-taupe/30 py-16">
      <Container className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <LogoDraw>
            <Wordmark className="h-6 w-auto text-espresso" />
          </LogoDraw>
          <p className="eyebrow mt-4 text-mocha">{brand.tagline}</p>
        </div>
        <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-mocha">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="transition-colors hover:text-espresso"
                {...(link.external ? externalProps : {})}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 text-xs text-mocha lg:items-end">
          <span>
            © {new Date().getFullYear()} {footer.copyright}
          </span>
          {footer.privacy.href ? (
            <a href={footer.privacy.href} className="hover:text-espresso">
              {footer.privacy.label}
            </a>
          ) : (
            <span>{footer.privacy.label}</span>
          )}
        </div>
      </Container>
    </footer>
  );
}
