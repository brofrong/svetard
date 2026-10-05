import { expect, test } from "@playwright/test";
import { gotoHome } from "./helpers";

test("шёлк рендерится на десктопе без ошибок в консоли", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await gotoHome(page);
  const webgl = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  });
  await expect(page.locator("#top canvas")).toHaveCount(webgl ? 1 : 0, {
    timeout: 10_000,
  });
  await expect(page.locator("#top img")).toHaveCount(1);
  await page.waitForTimeout(1000);
  expect(errors).toEqual([]);
});
