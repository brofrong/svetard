import { expect, test } from "@playwright/test";
import { gotoHome } from "./helpers";

test("золотое кольцо-курсор следует за мышью", async ({ page }) => {
  await gotoHome(page);
  await page.mouse.move(400, 300);
  const ring = page.locator("[data-cursor-ring]");
  await expect(ring).toBeVisible();
  await expect
    .poll(async () => {
      const box = await ring.boundingBox();
      return box ? box.x + box.width / 2 : 0;
    })
    .toBeGreaterThan(380);
});

test("зерно не перехватывает клики", async ({ page }) => {
  await gotoHome(page);
  await expect(page.locator(".grain")).toHaveCSS("pointer-events", "none");
});
