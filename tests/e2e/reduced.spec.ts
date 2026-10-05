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

test("при reduced motion нет кастомного курсора", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.mouse.move(400, 300);
  await expect(page.locator("[data-cursor-ring]")).toBeHidden();
});

test("при reduced motion «Путь» — обычная сетка без закрепления", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#path")).not.toHaveAttribute(
    "data-horizontal",
    "",
  );
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("при reduced motion вместо WebGL — фото", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#top canvas")).toHaveCount(0);
  await expect(page.locator("#top img")).toHaveCount(1);
});
