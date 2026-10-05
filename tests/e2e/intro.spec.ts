import { expect, test } from "@playwright/test";

test("прелоадер играет при первом визите и пропускается при повторном", async ({
  page,
}) => {
  await page.goto("/");
  const preloader = page.locator(".preloader");
  await expect(preloader).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-intro", "done", {
    timeout: 8000,
  });
  await expect(preloader).toBeHidden();

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-intro", "skip");
  await expect(preloader).toBeHidden();
});

test("Lenis включён на десктопе", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("html.lenis")).toHaveCount(1);
});

test.describe("без JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("прелоадер не закрывает страницу", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".preloader")).toBeHidden({ timeout: 6000 });
    await expect(page.locator("h1")).toBeVisible();
  });
});
