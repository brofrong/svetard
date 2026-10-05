import { expect, test } from "@playwright/test";
import { effectiveOpacity } from "./helpers";

test("при reduced motion всё видно сразу, без прелоадера и Lenis", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("data-intro", "skip");
  await expect(page.locator(".preloader")).toBeHidden();
  await expect(page.locator("html.lenis")).toHaveCount(0);

  const headings = page.locator("h1, h2");
  const count = await headings.count();
  for (let index = 0; index < count; index += 1) {
    const heading = headings.nth(index);
    await heading.scrollIntoViewIfNeeded();
    expect(await effectiveOpacity(heading)).toBe(1);
  }
});
