import { expect, it } from "vitest";
import { cx } from "@/lib/cx";

it("cx отбрасывает пустые значения", () => {
  expect(cx("a", false, undefined, null, "", "b")).toBe("a b");
});
