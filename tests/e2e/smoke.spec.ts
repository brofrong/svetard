import { expect, test } from "@playwright/test";
import { site } from "@/content/site";
import { telegramLink, whatsappLink } from "@/lib/messenger";

test.describe("каркас страницы", () => {
  test("заголовок, язык и единственный h1", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/SVETARA/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ru");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("жить");
  });

  test("кнопка «Записаться» ведёт в Telegram с текстом", async ({ page }) => {
    await page.goto("/");
    const link = page
      .getByRole("banner")
      .getByRole("link", { name: site.header.cta });
    await expect(link).toHaveAttribute(
      "href",
      telegramLink(site.contacts.telegram, site.header.ctaMessage),
    );
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("в футере есть контакты", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(
      footer.getByRole("link", { name: site.footer.links.whatsapp }),
    ).toHaveAttribute("href", whatsappLink(site.contacts.whatsapp));
  });
});
