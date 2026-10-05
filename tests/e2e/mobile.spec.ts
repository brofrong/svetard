import { expect, test } from "@playwright/test";
import { scrollThrough } from "./helpers";

for (const width of [320, 412]) {
  test(`нет горизонтального скролла на ширине ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    await scrollThrough(page);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("на тач-устройстве нет кастомного курсора", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("[data-cursor-ring]")).toBeHidden();
});

test("плавающая кнопка Telegram появляется после первого экрана", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const button = page.locator("[data-floating-telegram]");
  await expect(button).toBeHidden();
  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(button).toBeVisible();
});
