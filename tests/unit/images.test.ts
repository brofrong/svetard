import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";
import { site } from "@/content/site";
import { collectImages } from "./helpers";

it("каждая картинка из контента лежит в public и не пустая", () => {
  for (const image of collectImages(site)) {
    const file = join(process.cwd(), "public", image.src);
    expect(existsSync(file), image.src).toBe(true);
    expect(statSync(file).size, image.src).toBeGreaterThan(10_000);
  }
});
