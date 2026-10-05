import { expect, it } from "vitest";
import { hexToRgb } from "@/lib/color";

it("hexToRgb переводит HEX в компоненты 0..1", () => {
  expect(hexToRgb("#ffffff")).toEqual([1, 1, 1]);
  expect(hexToRgb("#000000")).toEqual([0, 0, 0]);
  expect(hexToRgb("2a2420")).toEqual([42 / 255, 36 / 255, 32 / 255]);
});
