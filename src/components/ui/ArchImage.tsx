import Image from "next/image";
import { site } from "@/content/site";
import type { ImageRef } from "@/content/types";
import { cx } from "@/lib/cx";

type ArchImageProps = {
  image: ImageRef;
  sizes: string;
  className?: string;
  imgClassName?: string;
  preload?: boolean;
  shape?: "arch" | "none";
};

export function ArchImage({
  image,
  sizes,
  className,
  imgClassName,
  preload = false,
  shape = "arch",
}: ArchImageProps) {
  return (
    <div
      className={cx(
        "relative overflow-hidden",
        shape === "arch" && "rounded-t-full",
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        preload={preload}
        className={cx(
          "object-cover",
          site.media.warmFilter && "warm-photo",
          imgClassName,
        )}
      />
    </div>
  );
}
