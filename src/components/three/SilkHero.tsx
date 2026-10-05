"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { ImageRef } from "@/content/types";
import { readSilkEnv, shouldRenderSilk } from "@/lib/device";

const SilkCanvas = dynamic(() => import("./SilkCanvas"), { ssr: false });

export function SilkHero({ image }: { image: ImageRef }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(shouldRenderSilk(readSilkEnv()));
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <Image
        src={image.src}
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      {enabled ? <SilkCanvas /> : null}
      <div className="absolute inset-0 bg-linear-to-t from-ivory via-ivory/20 to-transparent" />
    </div>
  );
}
