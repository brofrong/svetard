import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { collectImages } from "./helpers";

const unique = (values: string[]) => new Set(values).size === values.length;

describe("контент сайта", () => {
  it("ровно один выделенный тариф, и у него есть бейдж", () => {
    const featured = site.pricing.plans.filter((plan) => plan.featured);
    expect(featured).toHaveLength(1);
    expect(featured[0].badge).toBeTruthy();
  });

  it("путь состоит из 5 шагов с уникальными ключами и тремя ключевыми словами", () => {
    expect(site.path.items).toHaveLength(5);
    expect(unique(site.path.items.map((step) => step.key))).toBe(true);
    for (const step of site.path.items) expect(step.keywords).toHaveLength(3);
  });

  it("id уникальны в услугах, тарифах, модулях и FAQ", () => {
    expect(unique(site.services.items.map((item) => item.id))).toBe(true);
    expect(unique(site.pricing.plans.map((plan) => plan.id))).toBe(true);
    expect(unique(site.program.modules.map((module) => module.id))).toBe(true);
    expect(unique(site.faq.items.map((item) => item.id))).toBe(true);
  });

  it("навигация ведёт на уникальные якоря", () => {
    for (const item of site.nav) expect(item.href).toMatch(/^#[a-z]+$/);
    expect(unique(site.nav.map((item) => item.href))).toBe(true);
  });

  it("контакты в правильном формате", () => {
    expect(site.contacts.telegram).toMatch(/^[A-Za-z0-9_]{5,32}$/);
    expect(site.contacts.whatsapp.replace(/\D/g, "")).toMatch(/^\d{10,15}$/);
    expect(site.url).toMatch(/^https:\/\/[^/]+$/);
  });

  it("у каждой кнопки мессенджера есть текст сообщения", () => {
    const texts = [
      site.header.ctaMessage,
      site.hero.messengerText,
      site.cta.messengerText,
      ...site.services.items.map((item) => item.messengerText),
      ...site.pricing.plans.map((plan) => plan.messengerText),
    ];
    for (const text of texts) expect(text.trim().length).toBeGreaterThan(10);
  });

  it("все картинки локальные jpg с alt", () => {
    const images = collectImages(site);
    expect(images.length).toBeGreaterThanOrEqual(18);
    for (const image of images) {
      expect(image.src).toMatch(/^\/images\/[a-z0-9-]+\.jpg$/);
      expect(image.alt.trim()).not.toBe("");
    }
  });

  it("звёздочки акцента в заголовках парные", () => {
    const titles = [
      site.hero.title,
      site.about.title,
      site.pains.title,
      site.path.title,
      site.services.title,
      site.program.title,
      site.results.title,
      site.pricing.title,
      site.ecosystem.title,
      site.faq.title,
      site.cta.title,
    ];
    for (const title of titles)
      expect((title.match(/\*/g) ?? []).length % 2).toBe(0);
  });
});
