import { expect, test } from "@playwright/test";
import { site } from "@/content/site";
import { telegramLink } from "@/lib/messenger";
import { gotoHome } from "./helpers";

test("цифры «Обо мне» доходят до значений из контента", async ({ page }) => {
  await gotoHome(page);
  const stats = page.locator("#about dl");
  await stats.scrollIntoViewIfNeeded();
  for (const stat of site.about.stats) {
    await expect(stats).toContainText(`${stat.value}${stat.suffix ?? ""}`, {
      timeout: 5000,
    });
  }
});

test("кнопки услуг ведут в Telegram с текстом услуги", async ({ page }) => {
  await gotoHome(page);
  // Reveal прячет карточки (visibility: hidden) до попадания в экран
  await page.locator("#services").scrollIntoViewIfNeeded();
  for (const service of site.services.items) {
    const card = page.locator("#services article", { hasText: service.title });
    await expect(card.getByRole("link")).toHaveAttribute(
      "href",
      telegramLink(site.contacts.telegram, service.messengerText),
    );
  }
});

test("«Путь» листается горизонтально при скролле", async ({ page }) => {
  await gotoHome(page);
  const section = page.locator("#path");
  await expect(section).toHaveAttribute("data-horizontal", "");
  const track = section.locator("[data-path-track]");
  const top = await section.evaluate(
    (el) => el.getBoundingClientRect().top + window.scrollY,
  );
  await page.evaluate((y) => window.scrollTo(0, y), top);
  const startX = await track.evaluate((el) => el.getBoundingClientRect().left);
  await page.evaluate((y) => window.scrollTo(0, y + 1200), top);
  await expect
    .poll(() => track.evaluate((el) => el.getBoundingClientRect().left))
    .toBeLessThan(startX - 300);
});

test("после ресайза последняя карточка «Пути» доезжает до края экрана", async ({
  page,
}) => {
  await gotoHome(page);
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForTimeout(600);
  const section = page.locator("#path");
  const pinEnd = await section.evaluate((el) => {
    const spacer = el.parentElement as HTMLElement;
    return (
      spacer.getBoundingClientRect().top +
      window.scrollY +
      spacer.offsetHeight -
      window.innerHeight
    );
  });
  await page.evaluate((y) => window.scrollTo(0, y), pinEnd);
  const gap = () =>
    section
      .locator("article")
      .last()
      .evaluate((el) =>
        Math.round(window.innerWidth - el.getBoundingClientRect().right),
      );
  await expect.poll(gap, { timeout: 5000 }).toBeGreaterThanOrEqual(-1);
  expect(await gap()).toBeLessThanOrEqual(60);
});

test("якорь из меню ведёт к началу секции под закреплённым «Путём»", async ({
  page,
}) => {
  await gotoHome(page);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Услуги" })
    .click();
  await expect
    .poll(
      () =>
        page
          .locator("#services")
          .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
      {
        timeout: 6000,
      },
    )
    .toBeLessThanOrEqual(120);
  expect(
    await page
      .locator("#services")
      .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
  ).toBeGreaterThanOrEqual(-5);
});

test("якорь вверх по странице оставляет место под видимой шапкой", async ({
  page,
}) => {
  await gotoHome(page);
  await page.locator("#faq").scrollIntoViewIfNeeded();
  await page.mouse.move(640, 400);
  await page.mouse.wheel(0, -300);
  const header = page.getByRole("banner");
  await expect
    .poll(() => header.evaluate((el) => el.getBoundingClientRect().top))
    .toBe(0);
  await header.getByRole("link", { name: "Обо мне" }).click();
  await expect
    .poll(
      () =>
        page
          .locator("#about")
          .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
      { timeout: 6000 },
    )
    .toBeGreaterThanOrEqual(70);
  expect(
    await page
      .locator("#about")
      .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
  ).toBeLessThanOrEqual(90);
});
