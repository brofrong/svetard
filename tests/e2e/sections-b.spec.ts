import { expect, test } from "@playwright/test";
import { site } from "@/content/site";
import { telegramLink, whatsappLink } from "@/lib/messenger";
import { gotoHome, SECTION_IDS } from "./helpers";

test("все секции и пункты меню на месте", async ({ page }) => {
  await gotoHome(page);
  for (const id of SECTION_IDS)
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  for (const item of site.nav)
    await expect(page.locator(item.href)).toHaveCount(1);
});

test("аккордеон программы: первый модуль открыт, клик переключает", async ({
  page,
}) => {
  await gotoHome(page);
  const buttons = page.locator("#program button[aria-expanded]");
  await expect(buttons.first()).toHaveAttribute("aria-expanded", "true");
  await buttons.nth(1).click();
  await expect(buttons.nth(1)).toHaveAttribute("aria-expanded", "true");
  await expect(buttons.first()).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#program")).toContainText(
    site.program.modules[1].points[0],
  );
});

test("FAQ раскрывает ответ", async ({ page }) => {
  await gotoHome(page);
  const item = site.faq.items[0];
  await page
    .locator("#faq")
    .getByRole("button", { name: item.question })
    .click();
  await expect(page.locator("#faq")).toContainText(item.answer);
});

test("шторка «до/после» двигается ползунком", async ({ page }) => {
  await gotoHome(page);
  await page.locator("#results input[type=range]").fill("20");
  await expect(page.locator("#results [data-before]")).toHaveAttribute(
    "style",
    /80%/,
  );
});

test("слайдер отзывов листается кнопкой", async ({ page }) => {
  await gotoHome(page);
  const list = page.locator("#results ul").first();
  await page.getByRole("button", { name: site.results.nextLabel }).click();
  await expect
    .poll(() => list.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(0);
});

test("тарифы: один выделенный, ссылки с названием тарифа", async ({ page }) => {
  await gotoHome(page);
  // Reveal прячет карточки (visibility: hidden) до попадания в экран
  await page.locator("#pricing").scrollIntoViewIfNeeded();
  await expect(page.locator("#pricing [data-featured]")).toHaveCount(1);
  for (const plan of site.pricing.plans) {
    const card = page.locator("#pricing article", {
      has: page.getByRole("heading", { name: plan.title, exact: true }),
    });
    await expect(
      card.getByRole("link", { name: site.pricing.cta }),
    ).toHaveAttribute(
      "href",
      telegramLink(site.contacts.telegram, plan.messengerText),
    );
    await expect(
      card.getByRole("link", { name: site.pricing.whatsappCta }),
    ).toHaveAttribute(
      "href",
      whatsappLink(site.contacts.whatsapp, plan.messengerText),
    );
  }
});

test("экосистема показывает все узлы", async ({ page }) => {
  await gotoHome(page);
  await expect(page.locator("[data-eco-node]")).toHaveCount(
    site.ecosystem.nodes.length,
  );
});

test("финальный призыв ведёт в оба мессенджера", async ({ page }) => {
  await gotoHome(page);
  const contact = page.locator("#contact");
  await expect(
    contact.getByRole("link", { name: site.cta.telegram }),
  ).toHaveAttribute(
    "href",
    telegramLink(site.contacts.telegram, site.cta.messengerText),
  );
  await expect(
    contact.getByRole("link", { name: site.cta.whatsapp }),
  ).toHaveAttribute(
    "href",
    whatsappLink(site.contacts.whatsapp, site.cta.messengerText),
  );
});
