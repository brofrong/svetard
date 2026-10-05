import { describe, expect, it } from "vitest";
import { splitAccent } from "@/lib/accent";

describe("splitAccent", () => {
  it("текст без акцента — одна часть", () => {
    expect(splitAccent("Тарифы")).toEqual([{ text: "Тарифы", accent: false }]);
  });

  it("выделяет слово в звёздочках", () => {
    expect(splitAccent("Тело, в котором хочется *жить*")).toEqual([
      { text: "Тело, в котором хочется ", accent: false },
      { text: "жить", accent: true },
    ]);
  });

  it("поддерживает несколько акцентов", () => {
    expect(splitAccent("*a* и *b*")).toEqual([
      { text: "a", accent: true },
      { text: " и ", accent: false },
      { text: "b", accent: true },
    ]);
  });

  it("одиночная звёздочка остаётся текстом", () => {
    expect(splitAccent("5 * 3")).toEqual([{ text: "5 * 3", accent: false }]);
  });

  it("пустая строка — пустой массив", () => {
    expect(splitAccent("")).toEqual([]);
  });
});
