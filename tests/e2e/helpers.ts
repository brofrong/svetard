import type { Locator, Page } from "@playwright/test";

export const SECTION_IDS = [
  "top",
  "about",
  "path",
  "services",
  "program",
  "results",
  "pricing",
  "faq",
  "contact",
] as const;

/** Открывает главную без прелоадера (ключ сессии уже стоит) и ждёт гидратацию. */
export async function gotoHome(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.sessionStorage.setItem("svetara-intro", "1");
  });
  await page.goto("/", { waitUntil: "networkidle" });
}

/** Прокручивает страницу до низа шагами по полэкрана, чтобы сработали все ScrollTrigger. */
export async function scrollThrough(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
  });
}

/** Итоговая прозрачность элемента с учётом всех предков. */
export async function effectiveOpacity(locator: Locator): Promise<number> {
  return locator.evaluate((element) => {
    let opacity = 1;
    let node: Element | null = element;
    while (node) {
      opacity *= Number(getComputedStyle(node).opacity);
      node = node.parentElement;
    }
    return opacity;
  });
}
