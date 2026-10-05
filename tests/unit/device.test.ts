import { describe, expect, it } from "vitest";
import { type SilkEnv, shouldRenderSilk } from "@/lib/device";

const desktop: SilkEnv = {
  reducedMotion: false,
  webgl: true,
  coarsePointer: false,
  cores: 8,
};

describe("shouldRenderSilk", () => {
  it("десктоп с WebGL — включён", () => {
    expect(shouldRenderSilk(desktop)).toBe(true);
  });

  it("reduced motion — выключен", () => {
    expect(shouldRenderSilk({ ...desktop, reducedMotion: true })).toBe(false);
  });

  it("нет WebGL — выключен", () => {
    expect(shouldRenderSilk({ ...desktop, webgl: false })).toBe(false);
  });

  it("слабое тач-устройство (≤ 4 ядер) — выключен", () => {
    expect(
      shouldRenderSilk({ ...desktop, coarsePointer: true, cores: 4 }),
    ).toBe(false);
  });

  it("мощное тач-устройство — включён", () => {
    expect(
      shouldRenderSilk({ ...desktop, coarsePointer: true, cores: 8 }),
    ).toBe(true);
  });
});
