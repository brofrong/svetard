import type { ReactNode } from "react";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";
import { telegramLink, whatsappLink } from "@/lib/messenger";

type Variant = "primary" | "outline" | "light";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-3 rounded-full font-sans uppercase transition-colors duration-500 ease-silk";

const sizes: Record<Size, string> = {
  md: "px-8 py-4 text-xs tracking-[0.25em]",
  sm: "px-5 py-2.5 text-[11px] tracking-[0.2em]",
};

const variants: Record<Variant, string> = {
  primary: "bg-espresso text-gold-2 hover:bg-mocha",
  outline:
    "border border-gold-3 text-espresso hover:bg-espresso hover:text-ivory",
  light:
    "border border-gold-2/70 text-ivory hover:bg-ivory hover:text-espresso",
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  className,
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={cx(base, sizes[size], variants[variant], className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export type Channel = "telegram" | "whatsapp";

export function messengerHref(channel: Channel, text?: string): string {
  return channel === "telegram"
    ? telegramLink(site.contacts.telegram, text)
    : whatsappLink(site.contacts.whatsapp, text);
}

type MessengerLinkProps = Omit<ButtonLinkProps, "href" | "external"> & {
  channel: Channel;
  text?: string;
};

export function MessengerLink({ channel, text, ...rest }: MessengerLinkProps) {
  return <ButtonLink href={messengerHref(channel, text)} external {...rest} />;
}
