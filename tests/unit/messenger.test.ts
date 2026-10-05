import { describe, expect, it } from "vitest";
import { telegramLink, whatsappLink } from "@/lib/messenger";

const decodedText = (href: string) => new URL(href).searchParams.get("text");

describe("telegramLink", () => {
  it("строит ссылку на чат без текста", () => {
    expect(telegramLink("svetara_coach")).toBe("https://t.me/svetara_coach");
  });

  it("убирает @ в начале username", () => {
    expect(telegramLink("@svetara_coach")).toBe("https://t.me/svetara_coach");
  });

  it("кодирует кириллицу, а пробелы как %20", () => {
    const text = "Хочу тариф «Комплекс»";
    expect(telegramLink("svetara_coach", text)).toBe(
      `https://t.me/svetara_coach?text=${encodeURIComponent(text)}`,
    );
    expect(telegramLink("svetara_coach", "a b")).toContain("text=a%20b");
  });

  it("не добавляет text для пустой строки", () => {
    expect(telegramLink("svetara_coach", "")).toBe(
      "https://t.me/svetara_coach",
    );
  });
});

describe("whatsappLink", () => {
  it("оставляет в номере только цифры", () => {
    expect(whatsappLink("+7 (999) 000-00-00")).toBe(
      "https://wa.me/79990000000",
    );
  });

  it("добавляет текст", () => {
    expect(decodedText(whatsappLink("+79990000000", "Привет!"))).toBe(
      "Привет!",
    );
  });
});

describe("спецсимволы в тексте", () => {
  const tricky = "Цена 5 000 ₽ & скидка? #1 + 🌿 100%";

  it.each([
    ["telegram", telegramLink("svetara_coach", tricky)],
    ["whatsapp", whatsappLink("79990000000", tricky)],
  ])("%s: текст восстанавливается без потерь", (_, href) => {
    expect(decodedText(href)).toBe(tricky);
    expect(new URL(href).search.split("&")).toHaveLength(1);
  });
});
