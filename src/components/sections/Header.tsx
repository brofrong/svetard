import { Wordmark } from "@/components/brand/Logo";
import { MessengerLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";

export function Header() {
  const { header, nav } = site;
  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-colors duration-500 data-[scrolled=true]:bg-ivory/85 data-[scrolled=true]:backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between gap-6">
        <a href="#top" aria-label={header.homeLabel} className="shrink-0">
          <Wordmark className="h-4 w-auto text-espresso" />
        </a>
        <nav aria-label={header.navLabel} className="hidden xl:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[11px] uppercase tracking-[0.2em] text-mocha transition-colors hover:text-espresso"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <MessengerLink
          channel="telegram"
          text={header.ctaMessage}
          variant="outline"
          size="sm"
        >
          {header.cta}
        </MessengerLink>
      </Container>
    </header>
  );
}
