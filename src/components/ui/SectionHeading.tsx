import { SplitHeading } from "@/components/motion/SplitHeading";
import { cx } from "@/lib/cx";

export type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  as?: "h1" | "h2";
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
};

export const headingClass =
  "font-serif text-[clamp(2.25rem,5vw,4.5rem)] font-light leading-[1.05]";

export function SectionHeading({
  eyebrow,
  title,
  as: Tag = "h2",
  tone = "light",
  align = "left",
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={cx(align === "center" && "text-center", className)}>
      <p className={cx("eyebrow", dark ? "text-gold-2" : "text-mocha")}>
        {eyebrow}
      </p>
      <span
        aria-hidden="true"
        className={cx(
          "mt-5 block h-px w-12",
          dark ? "bg-gold-2/60" : "bg-taupe/60",
          align === "center" && "mx-auto",
        )}
      />
      <SplitHeading
        as={Tag}
        text={title}
        tone={tone}
        className={cx(
          "mt-6",
          headingClass,
          dark ? "text-ivory" : "text-espresso",
        )}
      />
    </div>
  );
}
