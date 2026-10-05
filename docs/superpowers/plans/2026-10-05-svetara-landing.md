# SVETARA Landing — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Анимированный лендинг личного бренда SVETARA (нутрициолог + персональный тренер) на Next.js 16. Сайт собирается в Docker-образ и публикуется в GHCR через GitHub Actions.

**Architecture:** Next.js App Router с группами роутов `(marketing)` (лендинг) и `(platform)` (резерв). Секции — презентационные компоненты, весь текст берётся из `src/content/site.ts`. Анимации подключаются через обёртки из `src/components/motion/`. Каждая обёртка работает внутри `useGSAP` и `gsap.matchMedia()` и сама отключается при reduced-motion. Шёлк на WebGL — изолированный клиентский компонент, грузится лениво, при необходимости вместо него показывается фото.

**Tech Stack:** Next.js 16.3 (Turbopack, React Compiler), React 19.2, TypeScript 5, Tailwind CSS v4, GSAP 3.15 (ScrollTrigger, SplitText, DrawSVG) + @gsap/react, Lenis, Motion, three + @react-three/fiber, lucide-react, Biome 2, Vitest, Playwright, pnpm 12, Docker (node:24-alpine), GitHub Actions → ghcr.io.

**Spec:** `docs/superpowers/specs/2026-10-05-svetara-landing-design.md`

## Global Constraints

- Node 24 LTS (Docker `node:24-alpine`, CI `node-version: 24`); pnpm 12.9.1 из поля `packageManager`.
- Next.js 16.3.x. Перед использованием незнакомого API читать `node_modules/next/dist/docs/` (так требует `AGENTS.md`). `next/image`: вместо `priority` — `preload`; разрешено только качество 75.
- Линт и формат — только Biome (`pnpm lint`, `pnpm format`). ESLint и Prettier не ставить. Перед каждым коммитом: `pnpm format && pnpm lint`.
- Весь видимый пользователю текст — только в `src/content/site.ts`, на русском. В компонентах секций нет захардкоженного текста.
- Акцент в заголовках: `*слово*` → курсив золотом (`AccentText`).
- Цвета — только токены: `ivory #F7F3EC`, `sand #E6DCCF`, `caramel #D4AA78`, `taupe #8C7B6B`, `sage #7F8566`, `dusk #8FA3B5`, `espresso #2A2420`, `mocha #5E5248`, `gold-1 #B8893F`, `gold-2 #E8C98A`, `gold-3 #A67C3A`.
- Контраст WCAG AA. Текст на светлом фоне — `espresso` или `mocha`. `taupe` — только для линий. Золотой текст на светлом фоне — только `gold-3` и только ≥ 24px. На `espresso` — `gold-2`.
- Шрифты: Cormorant Garamond (заголовки, 300/400/500, есть italic) и Manrope (текст), подмножества `latin` + `cyrillic`, через `next/font/google`.
- Каждая GSAP-анимация живёт в `useGSAP(() => { const mm = gsap.matchMedia(); mm.add(MOTION_OK, …) })`. Эффекты для курсора и наведения — под `MOTION_FINE`. CSS ничего не прячет по умолчанию, начальные скрытые состояния выставляет только GSAP.
- Ссылки на мессенджеры строятся только через `telegramLink` / `whatsappLink` (`src/lib/messenger.ts`) или `messengerHref`. У внешних ссылок `target="_blank" rel="noopener noreferrer"`.
- Картинки — только локальные `/images/*.jpg` через `next/image`, внешних доменов нет.
- Доступность: один `<h1>`. У `<button>` всегда есть `type`. У SVG — `<title>` + `role="img"` или `aria-hidden="true"`.
- Раскладка: `Container` (`max-w-[1440px] px-6 lg:px-12`). Отступы секций `py-20 lg:py-32` или `lg:py-40`.
- Коммиты в формате conventional, в конце сообщения строка `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.

## Review Focus

1. **Клик по якорю, когда выше цели есть закреплённая секция «Путь».** Ожидание: страница доезжает до начала целевой секции, а не до места, рассчитанного без pin-spacer. Тест в задаче 8.
2. **Ресайз или поворот экрана после загрузки.** Ожидание: дистанция горизонтального скролла пересчитывается, последняя карточка «Пути» доезжает ровно до края экрана. Тест в задаче 8.
3. **Текст для мессенджера со спецсимволами** (`&`, `?`, `#`, `+`, `%`, эмодзи, кириллица). Ожидание: ссылка не ломается, текст восстанавливается без потерь. Тест в задаче 2.
4. **Узкий экран 320px и длинные русские слова** в крупных заголовках. Ожидание: нет горизонтальной прокрутки страницы. Тест в задачах 5 и 9 (`mobile.spec.ts` на 320 и 412).
5. **JS отключён или упал.** Ожидание: прелоадер не закрывает страницу, первый экран читается. Тест в задаче 6.

## Карта файлов

| Файл | Ответственность |
|---|---|
| `src/content/types.ts` | Типы контента |
| `src/content/site.ts` | Весь контент сайта |
| `src/lib/messenger.ts` | `telegramLink`, `whatsappLink` |
| `src/lib/accent.ts` | `splitAccent` — разбор `*акцента*` |
| `src/lib/device.ts` | `shouldRenderSilk`, `readSilkEnv`, `canUseWebGL` |
| `src/lib/color.ts` | `hexToRgb` для шейдера |
| `src/lib/cx.ts` | склейка классов |
| `src/lib/motion.ts` | медиазапросы `MOTION_OK`, `FINE_POINTER`, `MOTION_FINE` |
| `src/lib/intro.ts` | координация прелоадера и первого экрана |
| `src/lib/gsap.ts` | регистрация плагинов GSAP |
| `src/app/layout.tsx` | html, шрифты, метаданные, загрузочный скрипт прелоадера |
| `src/app/(marketing)/layout.tsx` | общие элементы лендинга: Preloader, SmoothScroll, Header, Footer, Cursor, Grain, FloatingTelegram |
| `src/app/(marketing)/page.tsx` | порядок секций |
| `src/app/(platform)/.gitkeep` | резерв под платформу |
| `src/app/api/health/route.ts` | healthcheck |
| `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/icon.svg` | SEO |
| `src/components/brand/Logo.tsx` | `Wordmark`, `LogoMark` |
| `src/components/ui/*` | `Container`, `Button` (`ButtonLink`, `MessengerLink`, `messengerHref`), `AccentText`, `SectionHeading`, `ArchImage`, `Accordion`, `TestimonialSlider`, `BeforeAfter` |
| `src/components/motion/*` | `SmoothScroll`, `Reveal`, `SplitHeading`, `Preloader`, `ArchReveal`, `Magnetic`, `Marquee`, `Counter`, `LogoDraw`, `Cursor`, `Grain` |
| `src/components/sections/*` | `Header`, `Hero`, `About`, `Pains`, `Path`, `Services`, `Program`, `Results`, `Pricing`, `Ecosystem`, `Faq`, `FinalCta`, `Footer`, `FloatingTelegram` |
| `src/components/three/*` | `SilkHero` (выбор: фото или канвас), `SilkCanvas`, `shader.ts` |
| `scripts/images.json`, `scripts/fetch-images.mjs` | загрузка фото-заглушек |
| `tests/unit/*` | Vitest |
| `tests/e2e/*` | Playwright |
| `Dockerfile`, `.dockerignore`, `.github/workflows/docker.yml` | деплой |

---

### Task 1: Каркас проекта и инструменты

**Files:**
- Create: весь шаблон `create-next-app` (package.json, tsconfig.json, next.config.ts, postcss.config.mjs, biome.json, pnpm-workspace.yaml, src/app/*, AGENTS.md, CLAUDE.md, .gitignore)
- Create: `vitest.config.ts`
- Modify: `src/app/page.tsx`, `.gitignore`, `biome.json`
- Delete: `public/*.svg`

**Interfaces:**
- Produces: скрипты `pnpm lint | format | test | test:e2e | images | build | start`; алиас `@/* → src/*`; Vitest ищет `tests/unit/**/*.test.ts`.

- [ ] **Step 1: Сгенерировать шаблон во временной папке и перенести его в репозиторий**

```bash
rm -rf /tmp/svetara-scaffold
cd /tmp && npx -y create-next-app@16.3.8 svetara-scaffold --ts --tailwind --app --src-dir --import-alias "@/*" --use-pnpm --biome --turbopack --yes --skip-install --disable-git
rsync -a /tmp/svetara-scaffold/ /Users/dmitiigorshkov/pet/svetard/
cd /Users/dmitiigorshkov/pet/svetard && rm -f public/*.svg && ls -a
```

Expected: в корне есть `package.json`, `biome.json`, `next.config.ts`, `src/`, `docs/`, `.git/`.

- [ ] **Step 2: Имя пакета, скрипты и зависимости**

```bash
cd /Users/dmitiigorshkov/pet/svetard
npm pkg set name=svetara
npm pkg set "scripts.lint=biome check" "scripts.format=biome check --write" "scripts.test=vitest run" "scripts.test:e2e=playwright test" "scripts.images=node scripts/fetch-images.mjs"
pnpm install
pnpm add gsap @gsap/react lenis motion three @react-three/fiber lucide-react
pnpm add -D vitest @playwright/test @types/three "@types/node@^24"
pnpm exec playwright install chromium
```

Expected: установка без ошибок. Предупреждение `Ignored build scripts` допустимо.

- [ ] **Step 3: Конфиг Vitest**

Create `vitest.config.ts`:

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
    passWithNoTests: true,
  },
});
```

- [ ] **Step 4: Biome и .gitignore**

Replace `biome.json` — номер схемы оставить таким, какой сгенерировал шаблон (`2.4.x`):

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.2/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": {
    "ignoreUnknown": true,
    "includes": [
      "**",
      "!node_modules",
      "!.next",
      "!dist",
      "!build",
      "!playwright-report",
      "!test-results"
    ]
  },
  "formatter": { "enabled": true, "indentStyle": "space", "indentWidth": 2 },
  "css": { "parser": { "tailwindDirectives": true } },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true },
    "domains": { "next": "recommended", "react": "recommended" }
  },
  "assist": { "actions": { "source": { "organizeImports": "on" } } }
}
```

Append to `.gitignore`:

```
# playwright / lighthouse
/playwright-report/
/test-results/
/blob-report/
/.lighthouse/
```

- [ ] **Step 5: Минимальная страница вместо шаблонной**

Replace `src/app/page.tsx`:

```tsx
export default function Home() {
  return <main>SVETARA</main>;
}
```

- [ ] **Step 6: Проверить инструменты**

Run: `pnpm format && pnpm lint && pnpm test && pnpm build`
Expected: Biome без ошибок, Vitest `No test files found` с кодом 0, `next build` успешен.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 16 app with Biome, Vitest and Playwright

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Чистые утилиты (TDD)

**Files:**
- Create: `src/lib/messenger.ts`, `src/lib/accent.ts`, `src/lib/device.ts`, `src/lib/cx.ts`
- Test: `tests/unit/messenger.test.ts`, `tests/unit/accent.test.ts`, `tests/unit/device.test.ts`, `tests/unit/cx.test.ts`

**Interfaces:**
- Produces:
  - `telegramLink(username: string, text?: string): string`
  - `whatsappLink(phone: string, text?: string): string`
  - `type AccentPart = { text: string; accent: boolean }`, `splitAccent(input: string): AccentPart[]`
  - `type SilkEnv = { reducedMotion: boolean; webgl: boolean; coarsePointer: boolean; cores: number }`, `shouldRenderSilk(env: SilkEnv): boolean`, `readSilkEnv(): SilkEnv`, `canUseWebGL(): boolean`
  - `cx(...classes: Array<string | false | null | undefined>): string`

- [ ] **Step 1: Написать падающие тесты**

Create `tests/unit/messenger.test.ts`:

```ts
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
    expect(telegramLink("svetara_coach", "")).toBe("https://t.me/svetara_coach");
  });
});

describe("whatsappLink", () => {
  it("оставляет в номере только цифры", () => {
    expect(whatsappLink("+7 (999) 000-00-00")).toBe("https://wa.me/79990000000");
  });

  it("добавляет текст", () => {
    expect(decodedText(whatsappLink("+79990000000", "Привет!"))).toBe("Привет!");
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
```

Create `tests/unit/accent.test.ts`:

```ts
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
```

Create `tests/unit/device.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { type SilkEnv, shouldRenderSilk } from "@/lib/device";

const desktop: SilkEnv = { reducedMotion: false, webgl: true, coarsePointer: false, cores: 8 };

describe("shouldRenderSilk", () => {
  it("десктоп с WebGL — включён", () => {
    expect(shouldRenderSilk(desktop)).toBe(true);
  });

  it("reduced motion — выключен", () => {
    expect(shouldRenderSilk({ ...desktop, reducedMotion: true })).toBe(false);
  });

  it("нет WebGL — выключен", () => {
    expect(shouldRenderSilk({ ...desktop, webgl: false })).toBe(false);
  });

  it("слабое тач-устройство (≤ 4 ядер) — выключен", () => {
    expect(shouldRenderSilk({ ...desktop, coarsePointer: true, cores: 4 })).toBe(false);
  });

  it("мощное тач-устройство — включён", () => {
    expect(shouldRenderSilk({ ...desktop, coarsePointer: true, cores: 8 })).toBe(true);
  });
});
```

Create `tests/unit/cx.test.ts`:

```ts
import { expect, it } from "vitest";
import { cx } from "@/lib/cx";

it("cx отбрасывает пустые значения", () => {
  expect(cx("a", false, undefined, null, "", "b")).toBe("a b");
});
```

- [ ] **Step 2: Убедиться, что тесты падают**

Run: `pnpm test`
Expected: FAIL — `Failed to resolve import "@/lib/messenger"` (и аналогично для остальных модулей).

- [ ] **Step 3: Реализация**

Create `src/lib/messenger.ts`:

```ts
function withText(base: string, text?: string): string {
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function telegramLink(username: string, text?: string): string {
  return withText(`https://t.me/${username.replace(/^@/, "")}`, text);
}

export function whatsappLink(phone: string, text?: string): string {
  return withText(`https://wa.me/${phone.replace(/\D/g, "")}`, text);
}
```

Create `src/lib/accent.ts`:

```ts
export type AccentPart = { text: string; accent: boolean };

const ACCENT = /(\*[^*]+\*)/;

export function splitAccent(input: string): AccentPart[] {
  return input
    .split(ACCENT)
    .filter(Boolean)
    .map((part) =>
      part.length > 2 && part.startsWith("*") && part.endsWith("*")
        ? { text: part.slice(1, -1), accent: true }
        : { text: part, accent: false },
    );
}
```

Create `src/lib/device.ts`:

```ts
export type SilkEnv = {
  reducedMotion: boolean;
  webgl: boolean;
  coarsePointer: boolean;
  cores: number;
};

export function shouldRenderSilk(env: SilkEnv): boolean {
  if (env.reducedMotion || !env.webgl) return false;
  if (env.coarsePointer && env.cores <= 4) return false;
  return true;
}

export function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function readSilkEnv(): SilkEnv {
  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    webgl: canUseWebGL(),
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    cores: navigator.hardwareConcurrency ?? 4,
  };
}
```

Create `src/lib/cx.ts`:

```ts
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
```

- [ ] **Step 4: Убедиться, что тесты проходят**

Run: `pnpm test`
Expected: PASS — 4 файла, все тесты зелёные.

- [ ] **Step 5: Commit**

```bash
pnpm format && pnpm lint
git add src/lib tests/unit
git commit -m "feat: add messenger links, accent parser and device helpers

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Модель контента

**Files:**
- Create: `src/content/types.ts`, `src/content/site.ts`
- Test: `tests/unit/site.test.ts`, `tests/unit/helpers.ts`

**Interfaces:**
- Consumes: ничего.
- Produces: `site: Site` и все типы из `types.ts` (`ImageRef`, `Stat`, `PathStep`, `Service`, `Plan`, `Testimonial`, `EcosystemIcon`, `FaqItem`, `BeforeAfterContent`, `Site`). Тестовый помощник `collectImages(value: unknown): ImageRef[]`.

- [ ] **Step 1: Написать падающий тест инвариантов контента**

Create `tests/unit/helpers.ts`:

```ts
import type { ImageRef } from "@/content/types";

export function collectImages(value: unknown, out: ImageRef[] = []): ImageRef[] {
  if (Array.isArray(value)) {
    for (const item of value) collectImages(item, out);
  } else if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.src === "string" && typeof record.alt === "string") {
      out.push({ src: record.src, alt: record.alt });
    } else {
      for (const item of Object.values(record)) collectImages(item, out);
    }
  }
  return out;
}
```

Create `tests/unit/site.test.ts`:

```ts
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
    for (const title of titles) expect((title.match(/\*/g) ?? []).length % 2).toBe(0);
  });
});
```

- [ ] **Step 2: Убедиться, что тест падает**

Run: `pnpm test tests/unit/site.test.ts`
Expected: FAIL — `Failed to resolve import "@/content/site"`.

- [ ] **Step 3: Типы**

Create `src/content/types.ts`:

```ts
export type ImageRef = { src: string; alt: string };
export type NavItem = { label: string; href: string };
export type Stat = { value: number; suffix?: string; label: string };
export type Pain = { title: string; text: string };
export type PathStep = {
  key: string;
  title: string;
  keywords: string[];
  text: string;
  image: ImageRef;
};
export type Service = {
  id: string;
  title: string;
  format: string;
  text: string;
  bullets: string[];
  image: ImageRef;
  messengerText: string;
};
export type ProgramModule = { id: string; title: string; points: string[] };
export type Testimonial = { name: string; result: string; text: string; image: ImageRef };
export type Plan = {
  id: string;
  title: string;
  period: string;
  price: string;
  features: string[];
  featured: boolean;
  badge?: string;
  messengerText: string;
};
export type EcosystemIcon = "user" | "leaf" | "dumbbell" | "users" | "play" | "sun";
export type EcosystemNode = { label: string; icon: EcosystemIcon };
export type FaqItem = { id: string; question: string; answer: string };
export type BeforeAfterContent = {
  before: ImageRef;
  after: ImageRef;
  beforeLabel: string;
  afterLabel: string;
  caption: string;
  sliderLabel: string;
};

type SectionIntro = { eyebrow: string; title: string };

export type Site = {
  url: string;
  brand: { name: string; tagline: string; expert: string; role: string };
  seo: { title: string; description: string; ogImage: ImageRef };
  contacts: { telegram: string; whatsapp: string; instagram: string; email: string };
  media: { warmFilter: boolean };
  nav: NavItem[];
  header: { cta: string; ctaMessage: string; homeLabel: string; navLabel: string };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    messengerText: string;
    image: ImageRef;
  };
  marquee: string[];
  about: SectionIntro & {
    paragraphs: string[];
    credentials: string[];
    stats: Stat[];
    image: ImageRef;
  };
  pains: SectionIntro & { items: Pain[] };
  path: SectionIntro & { items: PathStep[] };
  services: SectionIntro & { cta: string; items: Service[] };
  program: SectionIntro & { subtitle: string; modules: ProgramModule[] };
  results: SectionIntro & {
    prevLabel: string;
    nextLabel: string;
    testimonials: Testimonial[];
    beforeAfter: BeforeAfterContent;
  };
  pricing: SectionIntro & { cta: string; whatsappCta: string; plans: Plan[] };
  ecosystem: SectionIntro & { text: string; nodes: EcosystemNode[] };
  faq: SectionIntro & { items: FaqItem[] };
  cta: SectionIntro & {
    text: string;
    telegram: string;
    whatsapp: string;
    messengerText: string;
    image: ImageRef;
  };
  footer: {
    copyright: string;
    privacy: { label: string; href: string | null };
    links: { telegram: string; whatsapp: string; instagram: string };
    floatingLabel: string;
  };
};
```

- [ ] **Step 4: Контент**

Create `src/content/site.ts`:

```ts
import type { Site } from "./types";

// Все тексты, цены, контакты и фото — заглушки. Меняйте только этот файл и public/images.
export const site: Site = {
  url: "https://svetara.ru",
  brand: {
    name: "SVETARA",
    tagline: "Live. Feel. Choose.",
    expert: "Светлана",
    role: "Нутрициолог и персональный тренер",
  },
  seo: {
    title: "SVETARA — нутрициолог и персональный тренер",
    description:
      "Курсы по нутрициологии и персональные тренировки. Питание и движение, которые меняют тело и качество жизни — без жёстких диет и выгорания.",
    ogImage: { src: "/images/og.jpg", alt: "SVETARA — Live. Feel. Choose." },
  },
  contacts: {
    telegram: "svetara_coach",
    whatsapp: "+7 999 000-00-00",
    instagram: "https://instagram.com/svetara",
    email: "hello@svetara.ru",
  },
  media: { warmFilter: true },
  nav: [
    { label: "Обо мне", href: "#about" },
    { label: "Путь", href: "#path" },
    { label: "Услуги", href: "#services" },
    { label: "Программа", href: "#program" },
    { label: "Результаты", href: "#results" },
    { label: "Тарифы", href: "#pricing" },
    { label: "Вопросы", href: "#faq" },
  ],
  header: {
    cta: "Записаться",
    ctaMessage: "Здравствуйте! Хочу записаться на консультацию.",
    homeLabel: "SVETARA — наверх",
    navLabel: "Основная навигация",
  },
  hero: {
    eyebrow: "Нутрициолог · Персональный тренер",
    title: "Тело, в котором хочется *жить*",
    subtitle:
      "Питание и тренировки, которые меняют не только форму, но и качество жизни. Без жёстких диет, срывов и выгорания — через осознанный выбор.",
    primaryCta: "Выбрать программу",
    secondaryCta: "Написать в Telegram",
    messengerText: "Здравствуйте! Хочу подобрать программу питания и тренировок.",
    image: { src: "/images/hero-silk.jpg", alt: "Струящийся бежевый шёлк" },
  },
  marquee: [
    "Live",
    "Feel",
    "Choose",
    "Body",
    "Awareness",
    "Choice",
    "Freedom",
    "Transformation",
    "Aliveness",
  ],
  about: {
    eyebrow: "Обо мне",
    title: "Привет, я *Светлана*",
    paragraphs: [
      "Я нутрициолог и персональный тренер. Больше девяти лет помогаю людям выстраивать отношения с едой и телом так, чтобы результат держался годами, а не до первого отпуска.",
      "Мой подход — не про запреты. Мы разбираемся, как работает ваш организм, что ему действительно нужно, и шаг за шагом встраиваем новые привычки в реальную жизнь: с работой, семьёй и любимой едой.",
    ],
    credentials: [
      "Диплом нутрициолога",
      "Сертифицированный фитнес-тренер",
      "Специализация: женское здоровье",
      "Практика с 2017 года",
    ],
    stats: [
      { value: 9, suffix: "+", label: "лет практики" },
      { value: 600, suffix: "+", label: "клиентов" },
      { value: 4, label: "авторские программы" },
      { value: 92, suffix: "%", label: "доходят до цели" },
    ],
    image: {
      src: "/images/about-portrait.jpg",
      alt: "Светлана — нутрициолог и персональный тренер",
    },
  },
  pains: {
    eyebrow: "Знакомо?",
    title: "Если вы узнаёте себя — *нам по пути*",
    items: [
      {
        title: "Диеты не работают",
        text: "Вес уходит и возвращается, а каждая новая попытка даётся всё тяжелее.",
      },
      {
        title: "Нет энергии",
        text: "К обеду уже нет сил, держитесь на кофе и сладком, а сон не восстанавливает.",
      },
      {
        title: "Срывы и чувство вины",
        text: "Строгие ограничения заканчиваются перееданием и ощущением, что опять не получилось.",
      },
      {
        title: "Плато в тренировках",
        text: "Вы стараетесь, но тело не меняется, и мотивация тает с каждой неделей.",
      },
      {
        title: "Непонятно, что есть",
        text: "Информации слишком много, советы противоречат друг другу, и непонятно, кому верить.",
      },
      {
        title: "Нет времени на себя",
        text: "Работа, семья, дела — забота о теле всегда откладывается на понедельник.",
      },
    ],
  },
  path: {
    eyebrow: "Путь SVETARA",
    title: "Пять шагов к телу, в котором *хорошо*",
    items: [
      {
        key: "body",
        title: "Тело",
        keywords: ["Энергия", "Гармония", "Сила"],
        text: "Разбираем анализы, режим и привычки. Понимаем, с чего начинать именно вам.",
        image: { src: "/images/path-body.jpg", alt: "Спортивная девушка в лучах солнца" },
      },
      {
        key: "awareness",
        title: "Осознанность",
        keywords: ["Глубина", "Присутствие", "Внимание"],
        text: "Учимся слышать голод, насыщение и сигналы тела вместо подсчёта каждой калории.",
        image: {
          src: "/images/path-awareness.jpg",
          alt: "Девушка с закрытыми глазами в мягком свете",
        },
      },
      {
        key: "choice",
        title: "Выбор",
        keywords: ["Свобода", "Свой путь", "Решение"],
        text: "Составляем питание и тренировки, которые подходят вашей жизни, а не наоборот.",
        image: { src: "/images/path-choice.jpg", alt: "Светлая лестница под аркой" },
      },
      {
        key: "transformation",
        title: "Трансформация",
        keywords: ["Новые грани", "Развитие", "Результат"],
        text: "Тело меняется, а вместе с ним — самочувствие, сон и уверенность в себе.",
        image: { src: "/images/path-transformation.jpg", alt: "Складки бежевого шёлка" },
      },
      {
        key: "community",
        title: "Сообщество",
        keywords: ["Поддержка", "Единомышленники", "Совместный рост"],
        text: "Вы не одни: чат участников, живые встречи и поддержка на каждом этапе.",
        image: {
          src: "/images/path-community.jpg",
          alt: "Группа людей на совместной практике",
        },
      },
    ],
  },
  services: {
    eyebrow: "Услуги",
    title: "Выберите свой *формат*",
    cta: "Узнать подробнее",
    items: [
      {
        id: "nutrition",
        title: "Курс нутрициологии",
        format: "Онлайн · 8 недель",
        text: "Авторский курс об осознанном питании: от основ нутрициологии до собственного рациона без запретов.",
        bullets: [
          "Видеоуроки и рабочие тетради",
          "Разбор вашего дневника питания",
          "Чат с куратором",
        ],
        image: {
          src: "/images/service-nutrition.jpg",
          alt: "Тарелка с овощами, злаками и зеленью",
        },
        messengerText: "Здравствуйте! Интересует курс нутрициологии.",
      },
      {
        id: "training",
        title: "Персональные тренировки",
        format: "Онлайн и офлайн",
        text: "Индивидуальная программа под ваши цели, уровень подготовки и график — в зале, дома или онлайн.",
        bullets: [
          "Диагностика и план на 3 месяца",
          "Контроль техники",
          "Корректировка нагрузки каждую неделю",
        ],
        image: { src: "/images/service-training.jpg", alt: "Тренировка с гантелями" },
        messengerText: "Здравствуйте! Интересуют персональные тренировки.",
      },
      {
        id: "complex",
        title: "Комплексное сопровождение",
        format: "3 месяца",
        text: "Питание и тренировки в одной системе: максимальный результат и личная поддержка на всём пути.",
        bullets: [
          "План питания и тренировок",
          "Еженедельные созвоны",
          "Поддержка в мессенджере",
        ],
        image: { src: "/images/service-complex.jpg", alt: "Растяжка на рассвете" },
        messengerText: "Здравствуйте! Интересует комплексное сопровождение.",
      },
    ],
  },
  program: {
    eyebrow: "Программа курса",
    title: "Курс «Осознанное *питание*»",
    subtitle: "8 недель · 6 модулей · доступ к материалам навсегда",
    modules: [
      {
        id: "basics",
        title: "Основы нутрициологии",
        points: [
          "Как устроен обмен веществ",
          "Белки, жиры и углеводы без мифов",
          "Почему диеты не работают",
        ],
      },
      {
        id: "diagnostics",
        title: "Анализы и самодиагностика",
        points: [
          "Какие анализы сдать",
          "Дефициты витаминов и минералов",
          "Чек-лист самочувствия",
        ],
      },
      {
        id: "plate",
        title: "Тарелка без запретов",
        points: [
          "Принцип сбалансированной тарелки",
          "Перекусы и сладкое",
          "Питание в гостях и ресторане",
        ],
      },
      {
        id: "hormones",
        title: "Гормоны и энергия",
        points: [
          "Сахар в крови и тяга к сладкому",
          "Сон, стресс и аппетит",
          "Женский цикл и питание",
        ],
      },
      {
        id: "behaviour",
        title: "Пищевое поведение",
        points: [
          "Эмоциональное переедание",
          "Сигналы голода и насыщения",
          "Как выйти из цикла «срыв — вина»",
        ],
      },
      {
        id: "ration",
        title: "Ваш собственный рацион",
        points: [
          "Меню на неделю под ваши цели",
          "Список покупок и заготовки",
          "План поддержки результата",
        ],
      },
    ],
  },
  results: {
    eyebrow: "Результаты",
    title: "Истории *изменений*",
    prevLabel: "Предыдущий отзыв",
    nextLabel: "Следующий отзыв",
    testimonials: [
      {
        name: "Анна, 34",
        result: "−7 кг за 3 месяца",
        text: "Впервые похудела без голода и срывов. Главное — я наконец понимаю, что и зачем ем, и это осталось со мной.",
        image: { src: "/images/testimonial-1.jpg", alt: "Анна" },
      },
      {
        name: "Марина, 41",
        result: "Ушла усталость",
        text: "Через месяц пропала дневная сонливость, а тренировки стали в радость. Светлана видит человека, а не цифры на весах.",
        image: { src: "/images/testimonial-2.jpg", alt: "Марина" },
      },
      {
        name: "Ольга, 28",
        result: "Первый полумарафон",
        text: "Готовилась к первому полумарафону. Тренировки и питание в идеальном балансе — финишировала с улыбкой.",
        image: { src: "/images/testimonial-3.jpg", alt: "Ольга" },
      },
      {
        name: "Екатерина, 37",
        result: "−12 см в талии",
        text: "Комплексное сопровождение — лучшее вложение в себя за последние годы. Поддержка каждый день и без осуждения.",
        image: { src: "/images/testimonial-4.jpg", alt: "Екатерина" },
      },
    ],
    beforeAfter: {
      before: { src: "/images/before.jpg", alt: "Фото до начала программы" },
      after: { src: "/images/after.jpg", alt: "Фото после трёх месяцев программы" },
      beforeLabel: "До",
      afterLabel: "После",
      caption: "Анна, 3 месяца комплексного сопровождения",
      sliderLabel: "Сравнить фото до и после",
    },
  },
  pricing: {
    eyebrow: "Тарифы",
    title: "Инвестиция в *себя*",
    cta: "Выбрать тариф",
    whatsappCta: "или написать в WhatsApp",
    plans: [
      {
        id: "course",
        title: "Курс",
        period: "8 недель",
        price: "14 900 ₽",
        features: [
          "6 модулей видеоуроков",
          "Рабочие тетради и чек-листы",
          "Общий чат участников",
          "Доступ к материалам навсегда",
        ],
        featured: false,
        messengerText: "Здравствуйте! Хочу тариф «Курс».",
      },
      {
        id: "complex",
        title: "Комплекс",
        period: "3 месяца",
        price: "39 900 ₽",
        features: [
          "Всё из тарифа «Курс»",
          "Персональный план питания",
          "12 тренировок онлайн или офлайн",
          "Еженедельные созвоны",
          "Поддержка в мессенджере",
        ],
        featured: true,
        badge: "Выбор клиентов",
        messengerText: "Здравствуйте! Хочу тариф «Комплекс».",
      },
      {
        id: "training",
        title: "Тренировки",
        period: "месяц",
        price: "от 18 000 ₽",
        features: [
          "8 персональных тренировок",
          "Программа под ваши цели",
          "Контроль техники",
          "Рекомендации по питанию",
        ],
        featured: false,
        messengerText: "Здравствуйте! Хочу тариф «Тренировки».",
      },
    ],
  },
  ecosystem: {
    eyebrow: "Экосистема SVETARA",
    title: "Больше, чем *тренировки*",
    text: "SVETARA — пространство, где питание, движение и люди рядом работают на один результат: жизнь, в которой хорошо.",
    nodes: [
      { label: "Индивидуальный подход", icon: "user" },
      { label: "Питание и нутрициология", icon: "leaf" },
      { label: "Персональные тренировки", icon: "dumbbell" },
      { label: "Сообщество единомышленников", icon: "users" },
      { label: "Онлайн-платформа и контент", icon: "play" },
      { label: "Ретриты и живое общение", icon: "sun" },
    ],
  },
  faq: {
    eyebrow: "Вопросы",
    title: "Частые *вопросы*",
    items: [
      {
        id: "beginner",
        question: "Подойдёт ли курс, если я новичок?",
        answer:
          "Да. Курс построен от основ: мы начинаем с того, как работает организм, и постепенно переходим к практике. Специальных знаний не нужно.",
      },
      {
        id: "sweets",
        question: "Нужно ли будет отказаться от сладкого?",
        answer:
          "Нет. Мы не работаем с запретами — учимся встраивать любимую еду в рацион так, чтобы она не мешала результату.",
      },
      {
        id: "online",
        question: "Как проходят онлайн-тренировки?",
        answer:
          "По видеосвязи в удобное для вас время. Я вижу технику, корректирую нагрузку и подстраиваю программу под ваше оборудование — дома или в зале.",
      },
      {
        id: "health",
        question: "Есть ли противопоказания?",
        answer:
          "Перед стартом мы проводим анкетирование и при необходимости запрашиваем анализы. При хронических заболеваниях программа согласуется с вашим врачом.",
      },
      {
        id: "pace",
        question: "Что если я не успеваю проходить уроки?",
        answer:
          "Доступ к материалам остаётся навсегда, поэтому проходить курс можно в своём темпе. Чат и обратная связь работают весь поток.",
      },
      {
        id: "installments",
        question: "Можно ли оплатить частями?",
        answer:
          "Да, для тарифов «Комплекс» и «Тренировки» доступна оплата частями. Напишите мне — подберём удобный вариант.",
      },
      {
        id: "start",
        question: "Как начать?",
        answer:
          "Напишите в Telegram или WhatsApp. Договоримся о бесплатной 15-минутной консультации и выберем формат, который подойдёт именно вам.",
      },
    ],
  },
  cta: {
    eyebrow: "Live. Feel. Choose.",
    title: "Сделай свой *выбор*",
    text: "Напишите мне — обсудим ваши цели на бесплатной консультации и подберём программу.",
    telegram: "Telegram",
    whatsapp: "WhatsApp",
    messengerText: "Здравствуйте! Хочу записаться на бесплатную консультацию.",
    image: { src: "/images/cta-sunset.jpg", alt: "Закат над морем и горами" },
  },
  footer: {
    copyright: "SVETARA",
    privacy: { label: "Политика конфиденциальности", href: null },
    links: { telegram: "Telegram", whatsapp: "WhatsApp", instagram: "Instagram" },
    floatingLabel: "Написать в Telegram",
  },
};
```

- [ ] **Step 5: Убедиться, что тест проходит**

Run: `pnpm test`
Expected: PASS — все тесты, включая `site.test.ts`.

- [ ] **Step 6: Commit**

```bash
pnpm format && pnpm lint
git add src/content tests/unit
git commit -m "feat: add typed site content model with placeholder copy

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Фото-заглушки

**Files:**
- Create: `scripts/images.json`, `scripts/fetch-images.mjs`, `public/images/*.jpg` (18 файлов), `public/images/CREDITS.md`
- Test: `tests/unit/images.test.ts`

**Interfaces:**
- Consumes: `site` и `collectImages` (задача 3).
- Produces: файлы `public/images/<name>.jpg` для каждого `src` из `site.ts`.

- [ ] **Step 1: Написать падающий тест**

Create `tests/unit/images.test.ts`:

```ts
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";
import { site } from "@/content/site";
import { collectImages } from "./helpers";

it("каждая картинка из контента лежит в public и не пустая", () => {
  for (const image of collectImages(site)) {
    const file = join(process.cwd(), "public", image.src);
    expect(existsSync(file), image.src).toBe(true);
    expect(statSync(file).size, image.src).toBeGreaterThan(10_000);
  }
});
```

Run: `pnpm test tests/unit/images.test.ts`
Expected: FAIL — `/images/hero-silk.jpg: expected false to be true`.

- [ ] **Step 2: Манифест**

Create `scripts/images.json`. `pexelsId` для трёх файлов уже подобраны. Остальные `null` заполняются на шаге 4.

```json
[
  { "file": "hero-silk.jpg", "query": "beige silk", "width": 2400, "pexelsId": 8465944 },
  { "file": "og.jpg", "query": "beige silk", "width": 1200, "height": 630, "pexelsId": 8465944 },
  { "file": "about-portrait.jpg", "query": "woman portrait natural light beige", "width": 1400, "pexelsId": null },
  { "file": "path-body.jpg", "query": "woman back sports bra sunlight", "width": 1000, "pexelsId": null },
  { "file": "path-awareness.jpg", "query": "woman profile eyes closed sunlight", "width": 1000, "pexelsId": null },
  { "file": "path-choice.jpg", "query": "white arch stairs minimal architecture", "width": 1000, "pexelsId": null },
  { "file": "path-transformation.jpg", "query": "beige silk", "width": 1000, "pexelsId": 7232398 },
  { "file": "path-community.jpg", "query": "group meditation sitting together", "width": 1000, "pexelsId": null },
  { "file": "service-nutrition.jpg", "query": "healthy food bowl beige aesthetic", "width": 1200, "pexelsId": null },
  { "file": "service-training.jpg", "query": "woman dumbbell training warm light", "width": 1200, "pexelsId": null },
  { "file": "service-complex.jpg", "query": "woman yoga stretching sunrise", "width": 1200, "pexelsId": null },
  { "file": "testimonial-1.jpg", "query": "smiling woman portrait natural light", "width": 400, "height": 400, "pexelsId": null },
  { "file": "testimonial-2.jpg", "query": "woman 40s portrait natural light", "width": 400, "height": 400, "pexelsId": null },
  { "file": "testimonial-3.jpg", "query": "young woman runner portrait", "width": 400, "height": 400, "pexelsId": null },
  { "file": "testimonial-4.jpg", "query": "woman portrait beige background", "width": 400, "height": 400, "pexelsId": null },
  { "file": "before.jpg", "query": "woman casual standing full body neutral", "width": 1000, "height": 1250, "pexelsId": null },
  { "file": "after.jpg", "query": "fit woman sportswear standing full body", "width": 1000, "height": 1250, "pexelsId": null },
  { "file": "cta-sunset.jpg", "query": "sea mountains sunset calm", "width": 2000, "pexelsId": null }
]
```

- [ ] **Step 3: Скрипт загрузки**

Create `scripts/fetch-images.mjs`:

```js
import { mkdir, readFile, writeFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("./images.json", import.meta.url), "utf8"));
const outDir = new URL("../public/images/", import.meta.url);
await mkdir(outDir, { recursive: true });

const credits = [
  "# Фото-заглушки",
  "",
  "Источник: Pexels, бесплатная лицензия (https://www.pexels.com/license/). Замените на собственные фото.",
  "",
];

for (const image of manifest) {
  if (!Number.isInteger(image.pexelsId)) {
    throw new Error(`pexelsId не задан для ${image.file}`);
  }
  const params = new URLSearchParams({ auto: "compress", cs: "tinysrgb", w: String(image.width) });
  if (image.height) {
    params.set("h", String(image.height));
    params.set("fit", "crop");
  }
  const url = `https://images.pexels.com/photos/${image.pexelsId}/pexels-photo-${image.pexelsId}.jpeg?${params}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${image.file}: HTTP ${response.status}`);
  await writeFile(new URL(image.file, outDir), Buffer.from(await response.arrayBuffer()));
  credits.push(`- ${image.file} — https://www.pexels.com/photo/${image.pexelsId}/`);
  console.log(`✓ ${image.file}`);
}

await writeFile(new URL("CREDITS.md", outDir), `${credits.join("\n")}\n`);
```

- [ ] **Step 4: Подобрать `pexelsId` для каждой записи с `null`**

Для каждой такой записи:
1. WebFetch `https://www.pexels.com/search/<query через %20>/` с промптом: «List the photo page URLs (pexels.com/photo/...-<numeric id>/) with their alt descriptions. Output lines: id | description. Up to 15.»
2. Выбрать фото в стилистике брендбука: тёплые бежевые тона, мягкий солнечный свет, минимализм, без текста и логотипов. Для фитнеса и портретов — женщины. Записать числовой id в `pexelsId`.

Run: `pnpm images`
Expected: 18 строк `✓ <file>`, создан `public/images/CREDITS.md`.

3. Открыть каждый файл инструментом Read и посмотреть глазами. Если фото выбивается из стиля (холодное, яркое, с надписями, не по теме), заменить `pexelsId` и запустить `pnpm images` ещё раз.

- [ ] **Step 5: Убедиться, что тест проходит**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
pnpm format && pnpm lint
git add scripts public/images tests/unit/images.test.ts
git commit -m "feat: add Pexels placeholder photos with download script

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Дизайн-система, каркас страницы, статичный первый экран, Playwright

**Files:**
- Modify: `src/app/globals.css`, `src/app/layout.tsx`
- Delete: `src/app/page.tsx`
- Create: `src/app/(marketing)/layout.tsx`, `src/app/(marketing)/page.tsx`, `src/app/(platform)/.gitkeep`
- Create: `src/components/brand/Logo.tsx`
- Create: `src/components/ui/Container.tsx`, `Button.tsx`, `AccentText.tsx`, `SectionHeading.tsx`, `ArchImage.tsx`
- Create: `src/components/sections/Header.tsx`, `Hero.tsx`, `Footer.tsx`
- Create: `playwright.config.ts`
- Test: `tests/e2e/helpers.ts`, `tests/e2e/smoke.spec.ts`, `tests/e2e/mobile.spec.ts`

**Interfaces:**
- Consumes: `site`, `cx`, `splitAccent`, `telegramLink`, `whatsappLink`.
- Produces:
  - `Container({ children, className? })`
  - `ButtonLink({ href, children, variant?: "primary" | "outline" | "light", size?: "md" | "sm", external?, className? })`
  - `messengerHref(channel: "telegram" | "whatsapp", text?: string): string`
  - `MessengerLink({ channel, text?, children, variant?, size?, className? })`
  - `AccentText({ text, tone?: "light" | "dark" })`
  - `SectionHeading({ eyebrow, title, as?: "h1" | "h2", tone?: "light" | "dark", align?: "left" | "center", className? })`
  - `ArchImage({ image: ImageRef, sizes, className?, imgClassName?, preload?, shape?: "arch" | "none" })`
  - `Wordmark({ className?, title? })` — SVG с `data-wordmark`, у каждой буквы `data-draw`
  - `LogoMark({ className?, title? })` — SVG с `data-mark`, линии с `data-draw`, точка с `data-dot`
  - CSS-утилиты `eyebrow`, `bg-gold`, `warm-photo`, классы `.preloader`, `.grain`, `.gold-border`, keyframes `fade-in`
  - e2e-помощники: `SECTION_IDS`, `gotoHome(page)`, `scrollThrough(page)`, `effectiveOpacity(locator)`

- [ ] **Step 1: Конфиг Playwright и помощники**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: "list",
  timeout: 45_000,
  use: { baseURL: `http://127.0.0.1:${PORT}`, trace: "retain-on-failure" },
  projects: [
    {
      name: "desktop",
      testIgnore: /(mobile|reduced)\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: { args: ["--enable-unsafe-swiftshader"] },
      },
    },
    { name: "mobile", testMatch: /mobile\.spec\.ts/, use: { ...devices["Pixel 7"] } },
    {
      name: "reduced",
      testMatch: /reduced\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], contextOptions: { reducedMotion: "reduce" } },
    },
  ],
  webServer: {
    command: `pnpm build && pnpm start --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
```

Create `tests/e2e/helpers.ts`:

```ts
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
```

- [ ] **Step 2: Написать падающие e2e-тесты**

Create `tests/e2e/smoke.spec.ts`:

```ts
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
    const link = page.getByRole("banner").getByRole("link", { name: site.header.cta });
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
    await expect(footer.getByRole("link", { name: site.footer.links.whatsapp })).toHaveAttribute(
      "href",
      whatsappLink(site.contacts.whatsapp),
    );
  });
});
```

Create `tests/e2e/mobile.spec.ts`:

```ts
import { expect, test } from "@playwright/test";
import { scrollThrough } from "./helpers";

for (const width of [320, 412]) {
  test(`нет горизонтального скролла на ширине ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    await scrollThrough(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
```

Run: `pnpm test:e2e`
Expected: FAIL — `toHaveTitle` получает `Create Next App`, `h1` не найден.

- [ ] **Step 3: Глобальные стили**

Replace `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-ivory: #f7f3ec;
  --color-sand: #e6dccf;
  --color-caramel: #d4aa78;
  --color-taupe: #8c7b6b;
  --color-sage: #7f8566;
  --color-dusk: #8fa3b5;
  --color-espresso: #2a2420;
  --color-mocha: #5e5248;
  --color-gold-1: #b8893f;
  --color-gold-2: #e8c98a;
  --color-gold-3: #a67c3a;
  --ease-silk: cubic-bezier(0.22, 1, 0.36, 1);
}

@theme inline {
  --font-sans: var(--font-manrope), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-cormorant), ui-serif, Georgia, serif;
}

@layer base {
  html {
    background-color: var(--color-ivory);
    color: var(--color-espresso);
  }

  h1,
  h2,
  h3 {
    text-wrap: balance;
    overflow-wrap: break-word;
    hyphens: auto;
  }

  ::selection {
    background-color: var(--color-caramel);
    color: var(--color-espresso);
  }

  :focus-visible {
    outline: 2px solid var(--color-gold-3);
    outline-offset: 4px;
  }
}

@utility eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

@utility bg-gold {
  background-image: linear-gradient(
    120deg,
    var(--color-gold-1),
    var(--color-gold-2) 50%,
    var(--color-gold-3)
  );
}

@utility warm-photo {
  filter: sepia(0.15) saturate(0.92) contrast(0.96) brightness(1.02);
}

/* Прелоадер: скрыт при повторном визите, reduced motion и без JS; страховка — исчезает через 4 с */
.preloader {
  animation: preloader-failsafe 0.6s ease 4s forwards;
}

html[data-intro="skip"] .preloader {
  display: none;
}

@media (scripting: none) {
  .preloader {
    display: none;
  }
}

@keyframes preloader-failsafe {
  to {
    opacity: 0;
    visibility: hidden;
  }
}

.grain {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

@property --gold-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.gold-border {
  padding: 1px;
  background: conic-gradient(
    from var(--gold-angle),
    var(--color-gold-1),
    var(--color-gold-2),
    var(--color-gold-3),
    var(--color-gold-2),
    var(--color-gold-1)
  );
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
  animation: gold-spin 6s linear infinite;
}

@keyframes gold-spin {
  to {
    --gold-angle: 360deg;
  }
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gold-border {
    animation: none;
  }
}
```

- [ ] **Step 4: Root layout и группа (marketing)**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.seo.title,
  description: site.seo.description,
};

export const viewport: Viewport = { themeColor: "#f7f3ec" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${cormorant.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-svh bg-ivory font-sans text-espresso antialiased">{children}</body>
    </html>
  );
}
```

```bash
git rm -q src/app/page.tsx
mkdir -p "src/app/(marketing)" "src/app/(platform)" && touch "src/app/(platform)/.gitkeep"
```

Create `src/app/(marketing)/layout.tsx`:

```tsx
import type { ReactNode } from "react";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
```

Create `src/app/(marketing)/page.tsx`:

```tsx
import { Hero } from "@/components/sections/Hero";

export default function HomePage() {
  return <Hero />;
}
```

- [ ] **Step 5: Логотип**

Create `src/components/brand/Logo.tsx`. Это приближение логотипа из брендбука тонкими линиями. Буква «A» нарисована как «Λ». Линии рисуются штрихом, поэтому их можно анимировать через DrawSVG.

```tsx
import { useId } from "react";

const GLYPHS = [
  {
    id: "s",
    d: "M56 18C50 6 40 2 30 2C14 2 4 12 4 25C4 40 18 46 30 50C44 54 56 60 56 75C56 89 44 98 30 98C18 98 8 92 4 82",
  },
  { id: "v", d: "M100 2L130 98L160 2" },
  { id: "e", d: "M256 2H204V98H256M204 50H248" },
  { id: "t", d: "M300 2H360M330 2V98" },
  { id: "a1", d: "M400 98L430 2L460 98" },
  { id: "r", d: "M504 98V2H532C548 2 558 12 558 27C558 42 548 52 532 52H504M530 52L558 98" },
  { id: "a2", d: "M600 98L630 2L660 98" },
] as const;

type LogoProps = { className?: string; title?: string };

export function Wordmark({ className, title = "SVETARA" }: LogoProps) {
  return (
    <svg
      data-wordmark
      viewBox="-4 -4 668 108"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>{title}</title>
      {GLYPHS.map((glyph) => (
        <path key={glyph.id} data-draw d={glyph.d} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

export function LogoMark({ className, title = "SVETARA" }: LogoProps) {
  const gradientId = `gold-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const gold = `url(#${gradientId})`;
  return (
    <svg
      data-mark
      viewBox="0 0 100 120"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#B8893F" />
          <stop offset="0.5" stopColor="#E8C98A" />
          <stop offset="1" stopColor="#A67C3A" />
        </linearGradient>
      </defs>
      <g stroke={gold} strokeWidth={1.5} strokeLinecap="round">
        <circle data-draw cx="50" cy="68" r="46" vectorEffect="non-scaling-stroke" />
        <path data-draw d="M50 14C72 26 72 46 50 58S28 92 50 108" vectorEffect="non-scaling-stroke" />
        <path data-draw d="M46 20C64 30 66 46 48 56S30 90 50 108" vectorEffect="non-scaling-stroke" />
      </g>
      <circle data-dot cx="50" cy="6" r="2.5" fill={gold} />
    </svg>
  );
}
```

- [ ] **Step 6: UI-примитивы**

Create `src/components/ui/Container.tsx`:

```tsx
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-[1440px] px-6 lg:px-12", className)}>{children}</div>;
}
```

Create `src/components/ui/Button.tsx`:

```tsx
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";
import { telegramLink, whatsappLink } from "@/lib/messenger";

type Variant = "primary" | "outline" | "light";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-3 rounded-full font-sans uppercase transition-colors duration-500 ease-silk";

const sizes: Record<Size, string> = {
  md: "px-8 py-4 text-xs tracking-[0.25em]",
  sm: "px-5 py-2.5 text-[11px] tracking-[0.2em]",
};

const variants: Record<Variant, string> = {
  primary: "bg-espresso text-gold-2 hover:bg-mocha",
  outline: "border border-gold-3 text-espresso hover:bg-espresso hover:text-ivory",
  light: "border border-gold-2/70 text-ivory hover:bg-ivory hover:text-espresso",
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  className,
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={cx(base, sizes[size], variants[variant], className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export type Channel = "telegram" | "whatsapp";

export function messengerHref(channel: Channel, text?: string): string {
  return channel === "telegram"
    ? telegramLink(site.contacts.telegram, text)
    : whatsappLink(site.contacts.whatsapp, text);
}

type MessengerLinkProps = Omit<ButtonLinkProps, "href" | "external"> & {
  channel: Channel;
  text?: string;
};

export function MessengerLink({ channel, text, ...rest }: MessengerLinkProps) {
  return <ButtonLink href={messengerHref(channel, text)} external {...rest} />;
}
```

Create `src/components/ui/AccentText.tsx`:

```tsx
import { splitAccent } from "@/lib/accent";
import { cx } from "@/lib/cx";

type AccentTextProps = { text: string; tone?: "light" | "dark" };

export function AccentText({ text, tone = "light" }: AccentTextProps) {
  return splitAccent(text).map((part) =>
    part.accent ? (
      <em
        key={`a:${part.text}`}
        className={cx("font-normal italic", tone === "dark" ? "text-gold-2" : "text-gold-3")}
      >
        {part.text}
      </em>
    ) : (
      <span key={`t:${part.text}`}>{part.text}</span>
    ),
  );
}
```

Create `src/components/ui/SectionHeading.tsx`. Это статичная версия, в задаче 6 заголовок получит SplitText:

```tsx
import { AccentText } from "@/components/ui/AccentText";
import { cx } from "@/lib/cx";

export type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  as?: "h1" | "h2";
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
};

export const headingClass = "font-serif text-[clamp(2.25rem,5vw,4.5rem)] font-light leading-[1.05]";

export function SectionHeading({
  eyebrow,
  title,
  as: Tag = "h2",
  tone = "light",
  align = "left",
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={cx(align === "center" && "text-center", className)}>
      <p className={cx("eyebrow", dark ? "text-gold-2" : "text-mocha")}>{eyebrow}</p>
      <span
        aria-hidden="true"
        className={cx(
          "mt-5 block h-px w-12",
          dark ? "bg-gold-2/60" : "bg-taupe/60",
          align === "center" && "mx-auto",
        )}
      />
      <Tag className={cx("mt-6", headingClass, dark ? "text-ivory" : "text-espresso")}>
        <AccentText text={title} tone={tone} />
      </Tag>
    </div>
  );
}
```

Create `src/components/ui/ArchImage.tsx`:

```tsx
import Image from "next/image";
import { site } from "@/content/site";
import type { ImageRef } from "@/content/types";
import { cx } from "@/lib/cx";

type ArchImageProps = {
  image: ImageRef;
  sizes: string;
  className?: string;
  imgClassName?: string;
  preload?: boolean;
  shape?: "arch" | "none";
};

export function ArchImage({
  image,
  sizes,
  className,
  imgClassName,
  preload = false,
  shape = "arch",
}: ArchImageProps) {
  return (
    <div className={cx("relative overflow-hidden", shape === "arch" && "rounded-t-full", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        preload={preload}
        className={cx("object-cover", site.media.warmFilter && "warm-photo", imgClassName)}
      />
    </div>
  );
}
```

- [ ] **Step 7: Header, Hero, Footer (статичные версии)**

Create `src/components/sections/Header.tsx`:

```tsx
import { Wordmark } from "@/components/brand/Logo";
import { MessengerLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";

export function Header() {
  const { header, nav } = site;
  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-colors duration-500 data-[scrolled=true]:bg-ivory/85 data-[scrolled=true]:backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between gap-6">
        <a href="#top" aria-label={header.homeLabel} className="shrink-0">
          <Wordmark className="h-4 w-auto text-espresso" />
        </a>
        <nav aria-label={header.navLabel} className="hidden xl:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[11px] uppercase tracking-[0.2em] text-mocha transition-colors hover:text-espresso"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <MessengerLink channel="telegram" text={header.ctaMessage} variant="outline" size="sm">
          {header.cta}
        </MessengerLink>
      </Container>
    </header>
  );
}
```

Create `src/components/sections/Hero.tsx`:

```tsx
import Image from "next/image";
import { AccentText } from "@/components/ui/AccentText";
import { ButtonLink, MessengerLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";

export function Hero() {
  const { hero, brand } = site;
  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh items-end overflow-hidden pt-32 pb-20 lg:items-center lg:pb-0"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image src={hero.image.src} alt="" fill preload sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-ivory via-ivory/50 to-ivory/10" />
      </div>
      <Container>
        <div className="max-w-4xl">
          <p data-hero-fade className="eyebrow text-mocha">
            {hero.eyebrow}
          </p>
          <h1 className="mt-6 font-serif text-[clamp(3rem,8vw,7.5rem)] font-light leading-[0.95] text-espresso">
            <AccentText text={hero.title} />
          </h1>
          <p data-hero-fade className="mt-8 max-w-xl text-lg leading-relaxed text-mocha">
            {hero.subtitle}
          </p>
          <div data-hero-fade className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="#pricing">{hero.primaryCta}</ButtonLink>
            <MessengerLink channel="telegram" text={hero.messengerText} variant="outline">
              {hero.secondaryCta}
            </MessengerLink>
          </div>
          <p data-hero-fade className="eyebrow mt-16 text-mocha">
            {brand.tagline}
          </p>
        </div>
      </Container>
    </section>
  );
}
```

Create `src/components/sections/Footer.tsx`:

```tsx
import { Wordmark } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";
import { telegramLink, whatsappLink } from "@/lib/messenger";

const externalProps = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Footer() {
  const { footer, contacts, brand } = site;
  const links = [
    { label: footer.links.telegram, href: telegramLink(contacts.telegram), external: true },
    { label: footer.links.whatsapp, href: whatsappLink(contacts.whatsapp), external: true },
    { label: footer.links.instagram, href: contacts.instagram, external: true },
    { label: contacts.email, href: `mailto:${contacts.email}`, external: false },
  ];
  return (
    <footer className="border-t border-taupe/30 py-16">
      <Container className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Wordmark className="h-6 w-auto text-espresso" />
          <p className="eyebrow mt-4 text-mocha">{brand.tagline}</p>
        </div>
        <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-mocha">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="transition-colors hover:text-espresso"
                {...(link.external ? externalProps : {})}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 text-xs text-mocha lg:items-end">
          <span>
            © {new Date().getFullYear()} {footer.copyright}
          </span>
          {footer.privacy.href ? (
            <a href={footer.privacy.href} className="hover:text-espresso">
              {footer.privacy.label}
            </a>
          ) : (
            <span>{footer.privacy.label}</span>
          )}
        </div>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 8: Убедиться, что тесты проходят**

Run: `pnpm format && pnpm lint && pnpm test && pnpm test:e2e`
Expected: Biome чисто, Vitest PASS, Playwright PASS — `smoke.spec.ts` (3 теста, desktop) и `mobile.spec.ts` (2 теста, mobile).

- [ ] **Step 9: Визуальная проверка**

Run: `pnpm dev`, открыть `http://localhost:3000` (инструмент preview или скриншот Playwright). Проверить: шрифты кириллические (Cormorant в заголовке, Manrope в тексте), фон шёлка, слово «жить» курсивом золотом, логотип читается.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add design tokens, logo, UI primitives and static hero shell

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Фундамент анимаций — плавный скролл, появление, SplitText, прелоадер

**Files:**
- Create: `src/lib/motion.ts`, `src/lib/intro.ts`, `src/lib/gsap.ts`
- Create: `src/components/motion/SmoothScroll.tsx`, `Reveal.tsx`, `SplitHeading.tsx`, `Preloader.tsx`
- Modify: `src/app/layout.tsx` (загрузочный скрипт), `src/app/(marketing)/layout.tsx`, `src/components/ui/SectionHeading.tsx`, `src/components/sections/Header.tsx`, `src/components/sections/Hero.tsx`
- Test: `tests/e2e/intro.spec.ts`, `tests/e2e/reduced.spec.ts`

**Interfaces:**
- Consumes: `Wordmark`, `LogoMark`, `AccentText`, `headingClass`, `SectionHeadingProps`.
- Produces:
  - `MOTION_OK = "(prefers-reduced-motion: no-preference)"`, `FINE_POINTER = "(hover: hover) and (pointer: fine)"`, `MOTION_FINE`
  - `INTRO_STORAGE_KEY = "svetara-intro"`, `INTRO_DONE_EVENT`, `markIntroDone(): void`, `onIntroDone(cb: () => void): () => void`
  - `gsap`, `useGSAP`, `ScrollTrigger`, `SplitText`, `DrawSVGPlugin` из `@/lib/gsap`
  - `SmoothScroll()` — рендерит `null`, создаёт Lenis при `MOTION_OK`
  - `Reveal({ children, className?, stagger?, y? })` — анимирует прямых детей
  - `SplitHeading({ text, as?: "h1" | "h2" | "h3", className?, tone?, by?: "lines" | "chars" })`
  - `Preloader()`
  - Атрибут `html[data-intro]`: `"skip"` выставляет загрузочный скрипт, `"done"` — прелоадер после анимации.

- [ ] **Step 1: Написать падающие e2e-тесты**

Create `tests/e2e/intro.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("прелоадер играет при первом визите и пропускается при повторном", async ({ page }) => {
  await page.goto("/");
  const preloader = page.locator(".preloader");
  await expect(preloader).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-intro", "done", { timeout: 8000 });
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
```

Create `tests/e2e/reduced.spec.ts`:

```ts
import { expect, test } from "@playwright/test";
import { effectiveOpacity } from "./helpers";

test("при reduced motion всё видно сразу, без прелоадера и Lenis", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("data-intro", "skip");
  await expect(page.locator(".preloader")).toBeHidden();
  await expect(page.locator("html.lenis")).toHaveCount(0);

  const headings = page.locator("h1, h2");
  const count = await headings.count();
  for (let index = 0; index < count; index += 1) {
    const heading = headings.nth(index);
    await heading.scrollIntoViewIfNeeded();
    expect(await effectiveOpacity(heading)).toBe(1);
  }
});
```

Run: `pnpm test:e2e`
Expected: FAIL — `.preloader` не найден, `data-intro` отсутствует.

- [ ] **Step 2: Библиотечные модули**

Create `src/lib/motion.ts`:

```ts
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
export const MOTION_FINE = `${MOTION_OK} and ${FINE_POINTER}`;
```

Create `src/lib/intro.ts`:

```ts
export const INTRO_STORAGE_KEY = "svetara-intro";
export const INTRO_DONE_EVENT = "svetara:intro-done";

function isIntroDone(): boolean {
  const state = document.documentElement.dataset.intro;
  return state === "done" || state === "skip";
}

export function markIntroDone(): void {
  const root = document.documentElement;
  if (root.dataset.intro !== "skip") root.dataset.intro = "done";
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

export function onIntroDone(callback: () => void): () => void {
  if (isIntroDone()) {
    callback();
    return () => {};
  }
  window.addEventListener(INTRO_DONE_EVENT, callback, { once: true });
  return () => window.removeEventListener(INTRO_DONE_EVENT, callback);
}
```

Create `src/lib/gsap.ts`:

```ts
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin);

export { DrawSVGPlugin, gsap, ScrollTrigger, SplitText, useGSAP };
```

- [ ] **Step 3: Загрузочный скрипт в `<head>`**

In `src/app/layout.tsx` add an import and a constant above `export const metadata`:

```tsx
import { INTRO_STORAGE_KEY } from "@/lib/intro";

const introBoot = `try{var d=document.documentElement;if(sessionStorage.getItem("${INTRO_STORAGE_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.intro="skip"}}catch(e){}`;
```

and insert `<head>` as the first child of `<html>` (before `<body>`):

```tsx
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: статический загрузочный скрипт без пользовательских данных */}
        <script dangerouslySetInnerHTML={{ __html: introBoot }} />
      </head>
```

- [ ] **Step 4: Компоненты анимаций**

Create `src/components/motion/SmoothScroll.tsx`:

```tsx
"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

export function SmoothScroll() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const lenis = new Lenis({ autoRaf: false, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });
    return () => mm.revert();
  }, []);
  return null;
}
```

Create `src/components/motion/Reveal.tsx`:

```tsx
"use client";

import { type ReactNode, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

type RevealProps = { children: ReactNode; className?: string; stagger?: number; y?: number };

export function Reveal({ children, className, stagger = 0.12, y = 40 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const root = ref.current;
        if (!root || root.children.length === 0) return;
        gsap.from(root.children, {
          autoAlpha: 0,
          y,
          duration: 1.1,
          ease: "power3.out",
          stagger,
          scrollTrigger: { trigger: root, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
```

Create `src/components/motion/SplitHeading.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { AccentText } from "@/components/ui/AccentText";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

type SplitHeadingProps = {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  tone?: "light" | "dark";
  by?: "lines" | "chars";
};

export function SplitHeading({
  text,
  as: Tag = "h2",
  className,
  tone = "light",
  by = "lines",
}: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const element = ref.current;
        if (!element) return;
        const byChars = by === "chars";
        SplitText.create(element, {
          type: byChars ? "words,chars" : "lines",
          mask: byChars ? "words" : "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(byChars ? self.chars : self.lines, {
              yPercent: 110,
              duration: byChars ? 0.9 : 1.2,
              ease: "expo.out",
              stagger: byChars ? 0.03 : 0.1,
              scrollTrigger: { trigger: element, start: "top 85%", once: true },
            }),
        });
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      <AccentText text={text} tone={tone} />
    </Tag>
  );
}
```

Create `src/components/motion/Preloader.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { gsap, useGSAP } from "@/lib/gsap";
import { INTRO_STORAGE_KEY, markIntroDone } from "@/lib/intro";

export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      if (document.documentElement.dataset.intro === "skip") {
        markIntroDone();
        return;
      }
      root.style.animation = "none";
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {
        // приватный режим без sessionStorage: прелоадер просто покажется снова
      }
      gsap
        .timeline({
          onComplete: () => {
            root.style.display = "none";
            markIntroDone();
          },
        })
        .from(root.querySelectorAll("[data-mark] [data-draw]"), {
          drawSVG: 0,
          duration: 1.3,
          ease: "power2.inOut",
          stagger: 0.15,
        })
        .from(
          root.querySelector("[data-mark] [data-dot]"),
          { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%", duration: 0.4 },
          "-=0.5",
        )
        .from(
          root.querySelectorAll("[data-wordmark] [data-draw]"),
          { drawSVG: 0, duration: 0.8, ease: "power2.out", stagger: 0.06 },
          "-=0.6",
        )
        .to(root, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "+=0.25");
    },
    { scope: ref },
  );
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="preloader fixed inset-0 z-[100] grid place-items-center bg-ivory"
    >
      <div className="flex flex-col items-center gap-8">
        <LogoMark className="h-28 w-auto" />
        <Wordmark className="h-5 w-auto text-espresso" />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: SectionHeading на SplitHeading**

In `src/components/ui/SectionHeading.tsx` replace the import of `AccentText` with:

```tsx
import { SplitHeading } from "@/components/motion/SplitHeading";
```

and replace the whole `<Tag …>…</Tag>` element with:

```tsx
      <SplitHeading
        as={Tag}
        text={title}
        tone={tone}
        className={cx("mt-6", headingClass, dark ? "text-ivory" : "text-espresso")}
      />
```

- [ ] **Step 6: Header прячется при скролле вниз**

Replace `src/components/sections/Header.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { Wordmark } from "@/components/brand/Logo";
import { MessengerLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function Header() {
  const ref = useRef<HTMLElement>(null);
  const { header, nav } = site;

  useGSAP(() => {
    const element = ref.current;
    if (!element) return;
    let hidden = false;
    const setHidden = (next: boolean) => {
      if (next === hidden) return;
      hidden = next;
      gsap.to(element, { yPercent: next ? -100 : 0, duration: 0.45, ease: "power3.out" });
    };
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        element.dataset.scrolled = y > 40 ? "true" : "false";
        setHidden(y > 160 && self.direction === 1);
      },
    });
    // при фокусе с клавиатуры шапка всегда возвращается
    const reveal = () => setHidden(false);
    element.addEventListener("focusin", reveal);
    return () => element.removeEventListener("focusin", reveal);
  });

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500 data-[scrolled=true]:bg-ivory/85 data-[scrolled=true]:backdrop-blur-md"
    >
      <Container className="flex h-20 items-center justify-between gap-6">
        <a href="#top" aria-label={header.homeLabel} className="shrink-0">
          <Wordmark className="h-4 w-auto text-espresso" />
        </a>
        <nav aria-label={header.navLabel} className="hidden xl:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[11px] uppercase tracking-[0.2em] text-mocha transition-colors hover:text-espresso"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <MessengerLink channel="telegram" text={header.ctaMessage} variant="outline" size="sm">
          {header.cta}
        </MessengerLink>
      </Container>
    </header>
  );
}
```

- [ ] **Step 7: Hero — анимация после прелоадера**

Replace `src/components/sections/Hero.tsx` (разметка та же, что в задаче 5, плюс клиентская анимация):

```tsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import { AccentText } from "@/components/ui/AccentText";
import { ButtonLink, MessengerLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { MOTION_OK } from "@/lib/motion";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { hero, brand } = site;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const root = ref.current;
        const title = root?.querySelector("h1");
        if (!root || !title) return;
        const split = SplitText.create(title, { type: "lines", mask: "lines" });
        const fades = root.querySelectorAll("[data-hero-fade]");
        gsap.set(split.lines, { yPercent: 110 });
        gsap.set(fades, { autoAlpha: 0, y: 24 });
        return onIntroDone(() => {
          gsap
            .timeline()
            .to(split.lines, { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.12 })
            .to(
              fades,
              { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1 },
              "-=0.9",
            );
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate flex min-h-svh items-end overflow-hidden pt-32 pb-20 lg:items-center lg:pb-0"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image src={hero.image.src} alt="" fill preload sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-ivory via-ivory/50 to-ivory/10" />
      </div>
      <Container>
        <div className="max-w-4xl">
          <p data-hero-fade className="eyebrow text-mocha">
            {hero.eyebrow}
          </p>
          <h1 className="mt-6 font-serif text-[clamp(3rem,8vw,7.5rem)] font-light leading-[0.95] text-espresso">
            <AccentText text={hero.title} />
          </h1>
          <p data-hero-fade className="mt-8 max-w-xl text-lg leading-relaxed text-mocha">
            {hero.subtitle}
          </p>
          <div data-hero-fade className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="#pricing">{hero.primaryCta}</ButtonLink>
            <MessengerLink channel="telegram" text={hero.messengerText} variant="outline">
              {hero.secondaryCta}
            </MessengerLink>
          </div>
          <p data-hero-fade className="eyebrow mt-16 text-mocha">
            {brand.tagline}
          </p>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 8: Подключить в layout лендинга**

Replace `src/app/(marketing)/layout.tsx`:

```tsx
import type { ReactNode } from "react";
import { Preloader } from "@/components/motion/Preloader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 9: Убедиться, что тесты проходят**

Run: `pnpm format && pnpm lint && pnpm test && pnpm test:e2e`
Expected: PASS — `intro.spec.ts` (3), `reduced.spec.ts` (1), `smoke.spec.ts` (3), `mobile.spec.ts` (2).

Если тест «без JavaScript» падает на `toBeHidden` — проверить, что `.preloader` получает `animation` из `globals.css`: через 4.6 с должно стать `visibility: hidden`.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add smooth scroll, reveal and split-text motion with intro preloader

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Библиотека эффектов

**Files:**
- Create: `src/components/motion/ArchReveal.tsx`, `Magnetic.tsx`, `Marquee.tsx`, `Counter.tsx`, `LogoDraw.tsx`, `Cursor.tsx`, `Grain.tsx`
- Modify: `src/app/(marketing)/layout.tsx`, `src/components/sections/Hero.tsx`, `src/components/sections/Footer.tsx`
- Test: `tests/e2e/effects.spec.ts`, дополнить `tests/e2e/mobile.spec.ts` и `tests/e2e/reduced.spec.ts`

**Interfaces:**
- Consumes: `gsap`, `useGSAP`, `ScrollTrigger`, `MOTION_OK`, `MOTION_FINE`.
- Produces:
  - `ArchReveal({ children, className? })` — раскрытие через clip-path и параллакс первого `img` внутри
  - `Magnetic({ children, strength?: number })`
  - `Marquee({ items: string[] })`
  - `Counter({ value: number, suffix?: string })`
  - `LogoDraw({ children, className? })` — прорисовывает `[data-draw]` внутри при попадании в экран
  - `Cursor()` — элемент `[data-cursor-ring]`
  - `Grain()`

- [ ] **Step 1: Написать падающие тесты**

Create `tests/e2e/effects.spec.ts`:

```ts
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
```

Append to `tests/e2e/mobile.spec.ts`:

```ts
test("на тач-устройстве нет кастомного курсора", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("[data-cursor-ring]")).toBeHidden();
});
```

Append to `tests/e2e/reduced.spec.ts`:

```ts
test("при reduced motion нет кастомного курсора", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.mouse.move(400, 300);
  await expect(page.locator("[data-cursor-ring]")).toBeHidden();
});
```

Run: `pnpm test:e2e`
Expected: FAIL — `[data-cursor-ring]` и `.grain` не найдены.

- [ ] **Step 2: Реализация эффектов**

Create `src/components/motion/ArchReveal.tsx`:

```tsx
"use client";

import { type ReactNode, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

export function ArchReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const root = ref.current;
        if (!root) return;
        gsap.fromTo(
          root,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            ease: "expo.out",
            scrollTrigger: { trigger: root, start: "top 80%", once: true },
          },
        );
        const media = root.querySelector("img");
        if (media) {
          gsap.fromTo(
            media,
            { scale: 1.25, yPercent: -6 },
            {
              scale: 1.1,
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
```

Create `src/components/motion/Magnetic.tsx`:

```tsx
"use client";

import { type ReactNode, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_FINE } from "@/lib/motion";

export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_FINE, () => {
        const element = ref.current;
        if (!element) return;
        const xTo = gsap.quickTo(element, "x", { duration: 0.6, ease: "power3.out" });
        const yTo = gsap.quickTo(element, "y", { duration: 0.6, ease: "power3.out" });
        const move = (event: PointerEvent) => {
          const rect = element.getBoundingClientRect();
          xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
          yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        element.addEventListener("pointermove", move);
        element.addEventListener("pointerleave", leave);
        return () => {
          element.removeEventListener("pointermove", move);
          element.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="inline-block">
      {children}
    </div>
  );
}
```

Create `src/components/motion/Marquee.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

export function Marquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const track = ref.current?.querySelector<HTMLElement>("[data-track]");
        if (!track) return;
        const loop = gsap.to(track, { xPercent: -50, ease: "none", duration: 40, repeat: -1 });
        ScrollTrigger.create({
          onUpdate: (self) => {
            const boost = Math.min(Math.abs(self.getVelocity()) / 400, 4);
            gsap.to(loop, {
              timeScale: 1 + boost,
              duration: 0.2,
              overwrite: true,
              onComplete: () => {
                gsap.to(loop, { timeScale: 1, duration: 1 });
              },
            });
          },
        });
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} aria-hidden="true" className="overflow-hidden border-y border-taupe/30 py-6">
      <div data-track className="flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {items.map((item) => (
              <li
                key={item}
                className="flex items-center font-serif text-3xl font-light italic text-espresso lg:text-5xl"
              >
                <span className="px-8">{item}</span>
                <span className="text-gold-3 not-italic">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
```

Create `src/components/motion/Counter.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const element = ref.current;
        if (!element) return;
        const state = { n: 0 };
        const render = () => {
          element.textContent = `${Math.round(state.n)}${suffix}`;
        };
        render();
        gsap.to(state, {
          n: value,
          duration: 2,
          ease: "power2.out",
          onUpdate: render,
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
        });
        return () => {
          element.textContent = `${value}${suffix}`;
        };
      });
    },
    { scope: ref },
  );
  return (
    <span ref={ref} suppressHydrationWarning>
      {value}
      {suffix}
    </span>
  );
}
```

Create `src/components/motion/LogoDraw.tsx`:

```tsx
"use client";

import { type ReactNode, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

export function LogoDraw({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const root = ref.current;
        if (!root) return;
        gsap.from(root.querySelectorAll("[data-draw]"), {
          drawSVG: 0,
          duration: 2,
          ease: "power2.inOut",
          stagger: 0.1,
          scrollTrigger: { trigger: root, start: "top 95%", once: true },
        });
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
```

Create `src/components/motion/Cursor.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_FINE } from "@/lib/motion";

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_FINE, () => {
      const ring = ref.current;
      if (!ring) return;
      gsap.set(ring, { xPercent: -50, yPercent: -50 });
      const xTo = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
      const yTo = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });
      let active = false;
      const move = (event: PointerEvent) => {
        gsap.set(ring, { autoAlpha: 1 });
        xTo(event.clientX);
        yTo(event.clientY);
        const target = event.target instanceof Element ? event.target : null;
        const interactive = Boolean(target?.closest("a, button, input, [data-cursor]"));
        if (interactive !== active) {
          active = interactive;
          gsap.to(ring, { scale: interactive ? 2.2 : 1, duration: 0.3 });
        }
      };
      window.addEventListener("pointermove", move);
      return () => {
        window.removeEventListener("pointermove", move);
        gsap.set(ring, { autoAlpha: 0 });
      };
    });
  });
  return (
    <div
      ref={ref}
      data-cursor-ring
      aria-hidden="true"
      className="pointer-events-none invisible fixed top-0 left-0 z-[90] size-8 rounded-full border border-gold-1"
    />
  );
}
```

Create `src/components/motion/Grain.tsx`:

```tsx
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="grain pointer-events-none fixed inset-0 z-[80] opacity-[0.06]"
    />
  );
}
```

- [ ] **Step 3: Подключить эффекты**

Replace `src/app/(marketing)/layout.tsx`:

```tsx
import type { ReactNode } from "react";
import { Cursor } from "@/components/motion/Cursor";
import { Grain } from "@/components/motion/Grain";
import { Preloader } from "@/components/motion/Preloader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <Cursor />
      <Grain />
    </>
  );
}
```

In `src/components/sections/Hero.tsx` add `import { Magnetic } from "@/components/motion/Magnetic";` and replace the buttons block with:

```tsx
          <div data-hero-fade className="mt-10 flex flex-wrap gap-4">
            <Magnetic>
              <ButtonLink href="#pricing">{hero.primaryCta}</ButtonLink>
            </Magnetic>
            <Magnetic>
              <MessengerLink channel="telegram" text={hero.messengerText} variant="outline">
                {hero.secondaryCta}
              </MessengerLink>
            </Magnetic>
          </div>
```

In `src/components/sections/Footer.tsx` add `import { LogoDraw } from "@/components/motion/LogoDraw";` and wrap the wordmark:

```tsx
          <LogoDraw>
            <Wordmark className="h-6 w-auto text-espresso" />
          </LogoDraw>
```

- [ ] **Step 4: Убедиться, что тесты проходят**

Run: `pnpm format && pnpm lint && pnpm test:e2e`
Expected: PASS — все проекты, включая новые тесты курсора и зерна.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add arch reveal, magnetic, marquee, counter, cursor and grain effects

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Секции, часть 1 — бегущая строка, «Обо мне», «Знакомо?», «Путь», «Услуги»

**Files:**
- Create: `src/components/sections/About.tsx`, `Pains.tsx`, `Path.tsx`, `Services.tsx`
- Modify: `src/app/(marketing)/page.tsx`
- Test: `tests/e2e/sections-a.spec.ts`, дополнить `tests/e2e/reduced.spec.ts`

**Interfaces:**
- Consumes: `site`, `SectionHeading`, `ArchImage`, `Container`, `MessengerLink`, `Reveal`, `ArchReveal`, `Counter`, `Marquee`, `gsap`, `MOTION_OK`.
- Produces: секции с id `about`, `path`, `services`. У `#path` атрибут `data-horizontal`, когда включён горизонтальный режим; трек `[data-path-track]`, полоса прогресса `[data-path-progress]`.

- [ ] **Step 1: Написать падающие тесты**

Create `tests/e2e/sections-a.spec.ts`:

```ts
import { expect, test } from "@playwright/test";
import { site } from "@/content/site";
import { telegramLink } from "@/lib/messenger";
import { gotoHome } from "./helpers";

test("цифры «Обо мне» доходят до значений из контента", async ({ page }) => {
  await gotoHome(page);
  const stats = page.locator("#about dl");
  await stats.scrollIntoViewIfNeeded();
  for (const stat of site.about.stats) {
    await expect(stats).toContainText(`${stat.value}${stat.suffix ?? ""}`, { timeout: 5000 });
  }
});

test("кнопки услуг ведут в Telegram с текстом услуги", async ({ page }) => {
  await gotoHome(page);
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
  const top = await section.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  await page.evaluate((y) => window.scrollTo(0, y), top);
  const startX = await track.evaluate((el) => el.getBoundingClientRect().left);
  await page.evaluate((y) => window.scrollTo(0, y + 1200), top);
  await expect
    .poll(() => track.evaluate((el) => el.getBoundingClientRect().left))
    .toBeLessThan(startX - 300);
});

test("после ресайза последняя карточка «Пути» доезжает до края экрана", async ({ page }) => {
  await gotoHome(page);
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForTimeout(600);
  const section = page.locator("#path");
  const pinEnd = await section.evaluate((el) => {
    const spacer = el.parentElement as HTMLElement;
    return spacer.getBoundingClientRect().top + window.scrollY + spacer.offsetHeight - window.innerHeight;
  });
  await page.evaluate((y) => window.scrollTo(0, y), pinEnd);
  const gap = () =>
    section
      .locator("article")
      .last()
      .evaluate((el) => Math.round(window.innerWidth - el.getBoundingClientRect().right));
  await expect.poll(gap, { timeout: 5000 }).toBeGreaterThanOrEqual(-1);
  expect(await gap()).toBeLessThanOrEqual(60);
});

test("якорь из меню ведёт к началу секции под закреплённым «Путём»", async ({ page }) => {
  await gotoHome(page);
  await page.getByRole("navigation").getByRole("link", { name: "Услуги" }).click();
  await expect
    .poll(() => page.locator("#services").evaluate((el) => Math.round(el.getBoundingClientRect().top)), {
      timeout: 6000,
    })
    .toBeLessThanOrEqual(120);
  expect(
    await page.locator("#services").evaluate((el) => Math.round(el.getBoundingClientRect().top)),
  ).toBeGreaterThanOrEqual(-5);
});
```

Append to `tests/e2e/reduced.spec.ts`:

```ts
test("при reduced motion «Путь» — обычная сетка без закрепления", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#path")).not.toHaveAttribute("data-horizontal", "");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});
```

Run: `pnpm test:e2e`
Expected: FAIL — `#about dl`, `#services`, `#path` не найдены.

- [ ] **Step 2: Секции**

Create `src/components/sections/About.tsx`:

```tsx
import { ArchReveal } from "@/components/motion/ArchReveal";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { ArchImage } from "@/components/ui/ArchImage";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

export function About() {
  const { about } = site;
  return (
    <section id="about" className="py-20 lg:py-40">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <ArchReveal className="lg:col-span-5">
          <ArchImage
            image={about.image}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[3/4]"
          />
        </ArchReveal>
        <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
          <SectionHeading eyebrow={about.eyebrow} title={about.title} />
          <Reveal className="mt-8 space-y-5 text-lg leading-relaxed text-mocha">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
          <Reveal className="mt-10 flex flex-wrap gap-3" stagger={0.06} y={16}>
            {about.credentials.map((credential) => (
              <span
                key={credential}
                className="rounded-full border border-taupe/50 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-mocha"
              >
                {credential}
              </span>
            ))}
          </Reveal>
          <dl className="mt-14 grid grid-cols-2 gap-8 border-t border-taupe/40 pt-10 sm:grid-cols-4">
            {about.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-2">
                <dt className="text-xs uppercase tracking-[0.2em] text-mocha">{stat.label}</dt>
                <dd className="font-serif text-5xl font-light text-espresso">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
```

Create `src/components/sections/Pains.tsx`:

```tsx
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

export function Pains() {
  const { pains } = site;
  return (
    <section className="bg-sand py-20 lg:py-32">
      <Container>
        <SectionHeading eyebrow={pains.eyebrow} title={pains.title} />
        <Reveal
          className="mt-14 grid gap-px bg-taupe/30 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {pains.items.map((pain) => (
            <article key={pain.title} className="group relative overflow-hidden bg-sand p-8 lg:p-10">
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-gold-2/30 to-transparent transition-transform duration-1000 ease-silk group-hover:translate-x-full"
              />
              <h3 className="relative font-serif text-2xl text-espresso lg:text-3xl">{pain.title}</h3>
              <p className="relative mt-3 leading-relaxed text-mocha">{pain.text}</p>
            </article>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
```

Create `src/components/sections/Path.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { ArchImage } from "@/components/ui/ArchImage";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

export function Path() {
  const ref = useRef<HTMLElement>(null);
  const { path } = site;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const section = ref.current;
        const track = section?.querySelector<HTMLElement>("[data-path-track]");
        const progress = section?.querySelector<HTMLElement>("[data-path-progress]");
        if (!section || !track) return;
        section.setAttribute("data-horizontal", "");
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        timeline.to(track, { x: () => -distance(), ease: "none" }, 0);
        if (progress) timeline.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
        return () => section.removeAttribute("data-horizontal");
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="path"
      className="group/path relative overflow-hidden bg-espresso py-20 text-ivory lg:py-24 data-[horizontal]:flex data-[horizontal]:min-h-svh data-[horizontal]:flex-col data-[horizontal]:justify-center data-[horizontal]:py-12"
    >
      <Container>
        <SectionHeading eyebrow={path.eyebrow} title={path.title} tone="dark" />
      </Container>
      <div
        data-path-track
        className="mt-12 grid gap-6 px-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:px-12 group-data-[horizontal]/path:flex group-data-[horizontal]/path:w-max"
      >
        {path.items.map((step, index) => (
          <article
            key={step.key}
            className="relative aspect-[3/4] overflow-hidden rounded-t-full group-data-[horizontal]/path:h-[52svh] group-data-[horizontal]/path:min-h-[22rem] group-data-[horizontal]/path:shrink-0"
          >
            <div className="absolute inset-0">
              <ArchImage
                image={step.image}
                sizes="(min-width: 1024px) 30vw, 70vw"
                shape="none"
                className="size-full"
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-espresso via-espresso/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
              <p className="font-serif text-2xl text-gold-2">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 font-serif text-3xl font-light">{step.title}</h3>
              <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-gold-2">
                {step.keywords.join(" · ")}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ivory/85">{step.text}</p>
            </div>
          </article>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="mx-6 mt-10 hidden h-px bg-ivory/15 group-data-[horizontal]/path:block lg:mx-12"
      >
        <div data-path-progress className="bg-gold h-px origin-left" />
      </div>
    </section>
  );
}
```

Create `src/components/sections/Services.tsx`:

```tsx
import { Reveal } from "@/components/motion/Reveal";
import { ArchImage } from "@/components/ui/ArchImage";
import { MessengerLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

export function Services() {
  const { services } = site;
  return (
    <section id="services" className="py-20 lg:py-40">
      <Container>
        <SectionHeading eyebrow={services.eyebrow} title={services.title} />
        <Reveal className="mt-16 grid gap-14 md:grid-cols-3 md:gap-8 lg:gap-12" stagger={0.15}>
          {services.items.map((service) => (
            <article key={service.id} className="group flex flex-col">
              <ArchImage
                image={service.image}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-[3/4]"
                imgClassName="transition-transform duration-[1600ms] ease-silk group-hover:scale-110"
              />
              <p className="eyebrow mt-8 text-mocha">{service.format}</p>
              <h3 className="mt-3 font-serif text-3xl text-espresso">{service.title}</h3>
              <p className="mt-4 leading-relaxed text-mocha">{service.text}</p>
              <ul className="mt-6 space-y-2 text-sm text-mocha">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-gold-3" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <MessengerLink channel="telegram" text={service.messengerText} variant="outline">
                  {services.cta}
                </MessengerLink>
              </div>
            </article>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: Порядок секций**

Replace `src/app/(marketing)/page.tsx`:

```tsx
import { Marquee } from "@/components/motion/Marquee";
import { About } from "@/components/sections/About";
import { Hero } from "@/components/sections/Hero";
import { Pains } from "@/components/sections/Pains";
import { Path } from "@/components/sections/Path";
import { Services } from "@/components/sections/Services";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee items={site.marquee} />
      <About />
      <Pains />
      <Path />
      <Services />
    </>
  );
}
```

- [ ] **Step 4: Убедиться, что тесты проходят**

Run: `pnpm format && pnpm lint && pnpm test:e2e`
Expected: PASS — `sections-a.spec.ts` (5), остальные без регрессий (в том числе `mobile.spec.ts` на 320px).

Если падает тест якоря, проверить порядок создания ScrollTrigger (Path должен создаваться до триггеров секций ниже) и вызвать `ScrollTrigger.refresh()` после `document.fonts.ready` в `SmoothScroll`:

```ts
document.fonts.ready.then(() => ScrollTrigger.refresh());
```

- [ ] **Step 5: Визуальная проверка**

`pnpm dev`. Пролистать страницу на десктопе (1440×900) и на мобильном (390×844). Проверить: в «Пути» карточки целиком помещаются в экран во время закрепления, текст на фото читается, арки ровные.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add about, pains, pinned path and services sections

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Секции, часть 2 — программа, результаты, тарифы, экосистема, FAQ, финальный призыв, плавающая кнопка

**Files:**
- Create: `src/components/ui/Accordion.tsx`, `src/components/ui/TestimonialSlider.tsx`, `src/components/ui/BeforeAfter.tsx`
- Create: `src/components/sections/Program.tsx`, `Results.tsx`, `Pricing.tsx`, `Ecosystem.tsx`, `Faq.tsx`, `FinalCta.tsx`, `FloatingTelegram.tsx`
- Modify: `src/app/(marketing)/page.tsx`, `src/app/(marketing)/layout.tsx`
- Test: `tests/e2e/sections-b.spec.ts`, дополнить `tests/e2e/mobile.spec.ts`

**Interfaces:**
- Consumes: всё из задач 5–8, `messengerHref`, `whatsappLink`, `Wordmark`, `SplitHeading`, `Magnetic`.
- Produces:
  - `type AccordionItem = { id: string; title: string; meta?: string; content: ReactNode }`, `Accordion({ items, defaultOpenId? })`
  - `TestimonialSlider({ items: Testimonial[], prevLabel, nextLabel })`
  - `BeforeAfter(props: BeforeAfterContent)` — `input[type=range]`, слой «до» `[data-before]`
  - секции с id `program`, `results`, `pricing`, `faq`, `contact`; у выделенного тарифа `[data-featured]`; у узлов экосистемы `[data-eco-node]`; плавающая кнопка `[data-floating-telegram]`

- [ ] **Step 1: Написать падающие тесты**

Create `tests/e2e/sections-b.spec.ts`:

```ts
import { expect, test } from "@playwright/test";
import { site } from "@/content/site";
import { telegramLink, whatsappLink } from "@/lib/messenger";
import { gotoHome, SECTION_IDS } from "./helpers";

test("все секции и пункты меню на месте", async ({ page }) => {
  await gotoHome(page);
  for (const id of SECTION_IDS) await expect(page.locator(`#${id}`)).toHaveCount(1);
  for (const item of site.nav) await expect(page.locator(item.href)).toHaveCount(1);
});

test("аккордеон программы: первый модуль открыт, клик переключает", async ({ page }) => {
  await gotoHome(page);
  const buttons = page.locator("#program button[aria-expanded]");
  await expect(buttons.first()).toHaveAttribute("aria-expanded", "true");
  await buttons.nth(1).click();
  await expect(buttons.nth(1)).toHaveAttribute("aria-expanded", "true");
  await expect(buttons.first()).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#program")).toContainText(site.program.modules[1].points[0]);
});

test("FAQ раскрывает ответ", async ({ page }) => {
  await gotoHome(page);
  const item = site.faq.items[0];
  await page.locator("#faq").getByRole("button", { name: item.question }).click();
  await expect(page.locator("#faq")).toContainText(item.answer);
});

test("шторка «до/после» двигается ползунком", async ({ page }) => {
  await gotoHome(page);
  await page.locator("#results input[type=range]").fill("20");
  await expect(page.locator("#results [data-before]")).toHaveAttribute("style", /80%/);
});

test("слайдер отзывов листается кнопкой", async ({ page }) => {
  await gotoHome(page);
  const list = page.locator("#results ul").first();
  await page.getByRole("button", { name: site.results.nextLabel }).click();
  await expect.poll(() => list.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
});

test("тарифы: один выделенный, ссылки с названием тарифа", async ({ page }) => {
  await gotoHome(page);
  await expect(page.locator("#pricing [data-featured]")).toHaveCount(1);
  for (const plan of site.pricing.plans) {
    const card = page.locator("#pricing article", { hasText: plan.title });
    await expect(card.getByRole("link", { name: site.pricing.cta })).toHaveAttribute(
      "href",
      telegramLink(site.contacts.telegram, plan.messengerText),
    );
    await expect(card.getByRole("link", { name: site.pricing.whatsappCta })).toHaveAttribute(
      "href",
      whatsappLink(site.contacts.whatsapp, plan.messengerText),
    );
  }
});

test("экосистема показывает все узлы", async ({ page }) => {
  await gotoHome(page);
  await expect(page.locator("[data-eco-node]")).toHaveCount(site.ecosystem.nodes.length);
});

test("финальный призыв ведёт в оба мессенджера", async ({ page }) => {
  await gotoHome(page);
  const contact = page.locator("#contact");
  await expect(contact.getByRole("link", { name: site.cta.telegram })).toHaveAttribute(
    "href",
    telegramLink(site.contacts.telegram, site.cta.messengerText),
  );
  await expect(contact.getByRole("link", { name: site.cta.whatsapp })).toHaveAttribute(
    "href",
    whatsappLink(site.contacts.whatsapp, site.cta.messengerText),
  );
});
```

Append to `tests/e2e/mobile.spec.ts`:

```ts
test("плавающая кнопка Telegram появляется после первого экрана", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const button = page.locator("[data-floating-telegram]");
  await expect(button).toBeHidden();
  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(button).toBeVisible();
});
```

Run: `pnpm test:e2e`
Expected: FAIL — нет `#program`, `#results`, `#pricing`, `#faq`, `#contact`.

- [ ] **Step 2: UI-компоненты**

Create `src/components/ui/Accordion.tsx`:

```tsx
"use client";

import { Plus } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { type ReactNode, useId, useState } from "react";
import { cx } from "@/lib/cx";

export type AccordionItem = { id: string; title: string; meta?: string; content: ReactNode };

type AccordionProps = { items: AccordionItem[]; defaultOpenId?: string };

export function Accordion({ items, defaultOpenId }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);
  const baseId = useId();
  return (
    <MotionConfig reducedMotion="user">
      <ul className="border-t border-taupe/40">
        {items.map((item) => {
          const isOpen = openId === item.id;
          const buttonId = `${baseId}-${item.id}-button`;
          const panelId = `${baseId}-${item.id}-panel`;
          return (
            <li key={item.id} className="border-b border-taupe/40">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center gap-6 py-6 text-left lg:py-8"
                >
                  {item.meta ? (
                    <span className="font-serif text-2xl text-gold-3 lg:text-3xl">{item.meta}</span>
                  ) : null}
                  <span className="flex-1 font-serif text-2xl font-light text-espresso lg:text-3xl">
                    {item.title}
                  </span>
                  <Plus
                    aria-hidden="true"
                    strokeWidth={1.25}
                    className={cx(
                      "size-5 shrink-0 text-gold-3 transition-transform duration-500 ease-silk",
                      isOpen && "rotate-45",
                    )}
                  />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.section
                    key="panel"
                    id={panelId}
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 leading-relaxed text-mocha lg:pl-16">{item.content}</div>
                  </motion.section>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </MotionConfig>
  );
}
```

Create `src/components/ui/TestimonialSlider.tsx`:

```tsx
"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import type { Testimonial } from "@/content/types";

type TestimonialSliderProps = { items: Testimonial[]; prevLabel: string; nextLabel: string };

const arrowClass =
  "grid size-12 place-items-center rounded-full border border-gold-3 text-espresso transition-colors duration-500 hover:bg-espresso hover:text-ivory";

export function TestimonialSlider({ items, prevLabel, nextLabel }: TestimonialSliderProps) {
  const listRef = useRef<HTMLUListElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const list = listRef.current;
    const card = list?.querySelector("li");
    if (!list || !card) return;
    list.scrollBy({ left: direction * (card.getBoundingClientRect().width + 24), behavior: "smooth" });
  };

  return (
    <div>
      <ul
        ref={listRef}
        className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto px-6 pb-4 [scrollbar-width:none] lg:-mx-12 lg:scroll-px-12 lg:px-12"
      >
        {items.map((testimonial) => (
          <li key={testimonial.name} className="w-[min(85vw,28rem)] shrink-0 snap-start">
            <figure className="flex h-full flex-col bg-ivory p-8 lg:p-10">
              <p className="eyebrow text-mocha">{testimonial.result}</p>
              <blockquote className="mt-6 flex-1 font-serif text-2xl leading-snug font-light text-espresso">
                «{testimonial.text}»
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.image.src}
                    alt={testimonial.image.alt}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </span>
                <span className="text-sm text-espresso">{testimonial.name}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex gap-3">
        <button type="button" aria-label={prevLabel} onClick={() => scrollByCard(-1)} className={arrowClass}>
          <ArrowLeft aria-hidden="true" strokeWidth={1.25} className="size-4" />
        </button>
        <button type="button" aria-label={nextLabel} onClick={() => scrollByCard(1)} className={arrowClass}>
          <ArrowRight aria-hidden="true" strokeWidth={1.25} className="size-4" />
        </button>
      </div>
    </div>
  );
}
```

Create `src/components/ui/BeforeAfter.tsx`:

```tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import type { BeforeAfterContent } from "@/content/types";

export function BeforeAfter({
  before,
  after,
  beforeLabel,
  afterLabel,
  caption,
  sliderLabel,
}: BeforeAfterContent) {
  const [position, setPosition] = useState(50);
  return (
    <figure>
      <div className="relative aspect-[4/5] select-none overflow-hidden rounded-t-full">
        <Image src={after.src} alt={after.alt} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
        <div
          data-before
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image src={before.src} alt={before.alt} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px bg-ivory"
          style={{ left: `${position}%` }}
        >
          <span className="absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ivory bg-espresso/40 text-ivory backdrop-blur">
            ↔
          </span>
        </div>
        <span className="eyebrow absolute bottom-6 left-6 rounded-full bg-espresso/60 px-3 py-1 text-ivory">
          {beforeLabel}
        </span>
        <span className="eyebrow absolute right-6 bottom-6 rounded-full bg-espresso/60 px-3 py-1 text-ivory">
          {afterLabel}
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label={sliderLabel}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-4 text-sm text-mocha">{caption}</figcaption>
    </figure>
  );
}
```

- [ ] **Step 3: Секции**

Create `src/components/sections/Program.tsx`:

```tsx
import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

export function Program() {
  const { program } = site;
  const items = program.modules.map((module, index) => ({
    id: module.id,
    meta: String(index + 1).padStart(2, "0"),
    title: module.title,
    content: (
      <ul className="space-y-2">
        {module.points.map((point) => (
          <li key={point}>— {point}</li>
        ))}
      </ul>
    ),
  }));
  return (
    <section id="program" className="py-20 lg:py-40">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <SectionHeading eyebrow={program.eyebrow} title={program.title} />
          <p className="eyebrow mt-8 text-mocha">{program.subtitle}</p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <Accordion items={items} defaultOpenId={program.modules[0]?.id} />
        </div>
      </Container>
    </section>
  );
}
```

Create `src/components/sections/Results.tsx`:

```tsx
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialSlider } from "@/components/ui/TestimonialSlider";
import { site } from "@/content/site";

export function Results() {
  const { results } = site;
  return (
    <section id="results" className="overflow-hidden bg-sand py-20 lg:py-40">
      <Container className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeading eyebrow={results.eyebrow} title={results.title} />
          <div className="mt-12">
            <TestimonialSlider
              items={results.testimonials}
              prevLabel={results.prevLabel}
              nextLabel={results.nextLabel}
            />
          </div>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <BeforeAfter {...results.beforeAfter} />
        </div>
      </Container>
    </section>
  );
}
```

Create `src/components/sections/Pricing.tsx`:

```tsx
import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { messengerHref, MessengerLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";

export function Pricing() {
  const { pricing } = site;
  return (
    <section id="pricing" className="bg-sand py-20 lg:py-40">
      <Container>
        <SectionHeading eyebrow={pricing.eyebrow} title={pricing.title} align="center" />
        <Reveal className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-stretch" stagger={0.15}>
          {pricing.plans.map((plan) => (
            <article
              key={plan.id}
              {...(plan.featured ? { "data-featured": "" } : {})}
              className={cx(
                "relative flex flex-col rounded-t-[12rem] px-8 pt-24 pb-10 text-center lg:px-10",
                plan.featured ? "bg-espresso text-ivory lg:-mt-6 lg:mb-6" : "bg-ivory text-espresso",
              )}
            >
              {plan.featured ? (
                <span aria-hidden="true" className="gold-border pointer-events-none absolute inset-0 rounded-t-[12rem]" />
              ) : null}
              {plan.badge ? <p className="eyebrow mb-4 text-gold-2">{plan.badge}</p> : null}
              <h3 className="font-serif text-4xl font-light">{plan.title}</h3>
              <p className={cx("eyebrow mt-3", plan.featured ? "text-ivory/80" : "text-mocha")}>{plan.period}</p>
              <p className="mt-8 font-serif text-5xl">{plan.price}</p>
              <ul className={cx("mt-10 space-y-3 text-left text-sm", plan.featured ? "text-ivory/85" : "text-mocha")}>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <Check
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className={cx("mt-0.5 size-4 shrink-0", plan.featured ? "text-gold-2" : "text-gold-3")}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col items-center gap-4 pt-10">
                <MessengerLink
                  channel="telegram"
                  text={plan.messengerText}
                  variant={plan.featured ? "light" : "primary"}
                >
                  {pricing.cta}
                </MessengerLink>
                <a
                  href={messengerHref("whatsapp", plan.messengerText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx(
                    "text-xs underline-offset-4 hover:underline",
                    plan.featured ? "text-ivory/80" : "text-mocha",
                  )}
                >
                  {pricing.whatsappCta}
                </a>
              </div>
            </article>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
```

Create `src/components/sections/Ecosystem.tsx`:

```tsx
"use client";

import { CirclePlay, Dumbbell, Leaf, type LucideIcon, Sun, User, Users } from "lucide-react";
import { useRef } from "react";
import { Wordmark } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";
import type { EcosystemIcon } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

const ICONS: Record<EcosystemIcon, LucideIcon> = {
  user: User,
  leaf: Leaf,
  dumbbell: Dumbbell,
  users: Users,
  play: CirclePlay,
  sun: Sun,
};

const RADIUS = 42;

function polar(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: Number((50 + RADIUS * Math.cos(angle)).toFixed(3)),
    y: Number((50 + RADIUS * Math.sin(angle)).toFixed(3)),
  };
}

export function Ecosystem() {
  const ref = useRef<HTMLElement>(null);
  const { ecosystem, brand } = site;
  const nodes = ecosystem.nodes.map((node, index) => ({
    ...node,
    ...polar(index, ecosystem.nodes.length),
  }));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const root = ref.current;
        const diagram = root?.querySelector("[data-eco-diagram]");
        if (!root || !diagram) return;
        const trigger = { trigger: diagram, start: "top 75%", once: true };
        gsap.from(root.querySelectorAll("[data-eco-line]"), {
          drawSVG: 0,
          duration: 1.4,
          ease: "power2.inOut",
          stagger: 0.08,
          scrollTrigger: { ...trigger },
        });
        gsap.from(root.querySelectorAll("[data-eco-node]"), {
          autoAlpha: 0,
          scale: 0.6,
          duration: 0.8,
          ease: "back.out(1.6)",
          stagger: 0.1,
          delay: 0.4,
          scrollTrigger: { ...trigger },
        });
        gsap.to(root.querySelector("[data-eco-orbit]"), {
          rotation: 360,
          duration: 90,
          ease: "none",
          repeat: -1,
        });
        gsap.to(root.querySelectorAll("[data-eco-node]"), {
          rotation: -360,
          duration: 90,
          ease: "none",
          repeat: -1,
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="overflow-hidden py-20 lg:py-40">
      <Container className="grid items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={ecosystem.eyebrow} title={ecosystem.title} />
          <p className="mt-8 max-w-md text-lg leading-relaxed text-mocha">{ecosystem.text}</p>
        </div>
        <div
          data-eco-diagram
          className="relative mx-auto aspect-square w-full max-w-[36rem] lg:col-span-6 lg:col-start-7"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="absolute inset-0 size-full"
            fill="none"
            stroke="var(--color-gold-3)"
            strokeWidth={1}
          >
            <circle data-eco-line cx="50" cy="50" r={RADIUS} strokeOpacity={0.6} vectorEffect="non-scaling-stroke" />
            <circle data-eco-line cx="50" cy="50" r="17" strokeOpacity={0.4} vectorEffect="non-scaling-stroke" />
          </svg>
          <div data-eco-orbit className="absolute inset-0">
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              className="absolute inset-0 size-full"
              fill="none"
              stroke="var(--color-gold-3)"
              strokeWidth={1}
              strokeOpacity={0.35}
            >
              {nodes.map((node) => (
                <line
                  key={node.label}
                  data-eco-line
                  x1="50"
                  y1="50"
                  x2={node.x}
                  y2={node.y}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
            <ul>
              {nodes.map((node) => {
                const Icon = ICONS[node.icon];
                return (
                  <li
                    key={node.label}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    <div data-eco-node className="flex w-24 flex-col items-center gap-2 sm:w-32">
                      <span className="grid size-11 place-items-center rounded-full border border-gold-3/60 bg-ivory sm:size-14">
                        <Icon aria-hidden="true" strokeWidth={1.25} className="size-5 text-gold-3" />
                      </span>
                      <span className="text-center text-[10px] leading-snug uppercase tracking-[0.15em] text-mocha sm:text-[11px]">
                        {node.label}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-3">
              <Wordmark className="h-4 w-auto text-espresso sm:h-6" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-mocha">{brand.tagline}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

Create `src/components/sections/Faq.tsx`:

```tsx
import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

export function Faq() {
  const { faq } = site;
  const items = faq.items.map((item) => ({
    id: item.id,
    title: item.question,
    content: <p>{item.answer}</p>,
  }));
  return (
    <section id="faq" className="bg-sand py-20 lg:py-32">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow={faq.eyebrow} title={faq.title} />
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <Accordion items={items} />
        </div>
      </Container>
    </section>
  );
}
```

Create `src/components/sections/FinalCta.tsx`:

```tsx
import { MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { MessengerLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";

export function FinalCta() {
  const { cta } = site;
  return (
    <section id="contact" className="relative isolate overflow-hidden bg-espresso py-28 text-ivory lg:py-48">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 mx-auto h-[85%] w-[min(90vw,56rem)] overflow-hidden rounded-t-full opacity-60"
      >
        <Image src={cta.image.src} alt="" fill sizes="(min-width: 1024px) 56rem, 90vw" className="warm-photo object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-espresso via-espresso/40 to-transparent" />
      </div>
      <Container className="text-center">
        <p className="eyebrow text-gold-2">{cta.eyebrow}</p>
        <SplitHeading
          as="h2"
          by="chars"
          tone="dark"
          text={cta.title}
          className="mt-6 font-serif text-[clamp(3rem,9vw,8rem)] font-light leading-none"
        />
        <p className="mx-auto mt-8 max-w-xl text-lg text-ivory/85">{cta.text}</p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Magnetic>
            <MessengerLink channel="telegram" text={cta.messengerText} variant="light">
              <Send aria-hidden="true" strokeWidth={1.5} className="size-4" />
              {cta.telegram}
            </MessengerLink>
          </Magnetic>
          <Magnetic>
            <MessengerLink channel="whatsapp" text={cta.messengerText} variant="light">
              <MessageCircle aria-hidden="true" strokeWidth={1.5} className="size-4" />
              {cta.whatsapp}
            </MessengerLink>
          </Magnetic>
        </div>
      </Container>
    </section>
  );
}
```

Create `src/components/sections/FloatingTelegram.tsx`:

```tsx
"use client";

import { Send } from "lucide-react";
import { useRef } from "react";
import { messengerHref } from "@/components/ui/Button";
import { site } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function FloatingTelegram() {
  const ref = useRef<HTMLAnchorElement>(null);
  useGSAP(() => {
    const button = ref.current;
    if (!button) return;
    gsap.set(button, { autoAlpha: 0, y: 16 });
    ScrollTrigger.create({
      trigger: "#top",
      start: "bottom 70%",
      onEnter: () => gsap.to(button, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }),
      onLeaveBack: () => gsap.to(button, { autoAlpha: 0, y: 16, duration: 0.3 }),
    });
  });
  return (
    <a
      ref={ref}
      data-floating-telegram
      href={messengerHref("telegram", site.header.ctaMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={site.footer.floatingLabel}
      className="invisible fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-espresso text-gold-2 shadow-lg lg:hidden"
    >
      <Send aria-hidden="true" strokeWidth={1.5} className="size-5" />
    </a>
  );
}
```

- [ ] **Step 4: Порядок секций и layout**

Replace `src/app/(marketing)/page.tsx`:

```tsx
import { Marquee } from "@/components/motion/Marquee";
import { About } from "@/components/sections/About";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Pains } from "@/components/sections/Pains";
import { Path } from "@/components/sections/Path";
import { Pricing } from "@/components/sections/Pricing";
import { Program } from "@/components/sections/Program";
import { Results } from "@/components/sections/Results";
import { Services } from "@/components/sections/Services";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee items={site.marquee} />
      <About />
      <Pains />
      <Path />
      <Services />
      <Program />
      <Results />
      <Pricing />
      <Ecosystem />
      <Faq />
      <FinalCta />
    </>
  );
}
```

In `src/app/(marketing)/layout.tsx` add `import { FloatingTelegram } from "@/components/sections/FloatingTelegram";` and render `<FloatingTelegram />` right after `<Footer />`.

- [ ] **Step 5: Убедиться, что тесты проходят**

Run: `pnpm format && pnpm lint && pnpm test && pnpm test:e2e`
Expected: PASS — все спеки во всех трёх проектах. Особенно: `mobile.spec.ts` на 320px (длинные заголовки, экосистема) и `reduced.spec.ts` (все `h2` с прозрачностью 1).

- [ ] **Step 6: Визуальная проверка**

`pnpm dev`. Пролистать всю страницу на десктопе и на мобильном. Проверить: золотая рамка у среднего тарифа вращается, экосистема не вылезает за экран на 320px, шторка «до/после» тянется пальцем, финальный заголовок появляется по буквам.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add program, results, pricing, ecosystem, faq and final CTA sections

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Шёлк на WebGL в первом экране

**Files:**
- Create: `src/lib/color.ts`, `src/components/three/shader.ts`, `src/components/three/SilkCanvas.tsx`, `src/components/three/SilkHero.tsx`
- Modify: `src/components/sections/Hero.tsx`
- Test: `tests/unit/color.test.ts`, `tests/e2e/silk.spec.ts`, дополнить `tests/e2e/reduced.spec.ts`

**Interfaces:**
- Consumes: `readSilkEnv`, `shouldRenderSilk` (задача 2), `ImageRef`.
- Produces: `hexToRgb(hex: string): [number, number, number]` (компоненты 0..1); `SilkHero({ image: ImageRef })` — фото + ленивый `<canvas>` поверх, когда разрешено.

- [ ] **Step 1: Написать падающие тесты**

Create `tests/unit/color.test.ts`:

```ts
import { expect, it } from "vitest";
import { hexToRgb } from "@/lib/color";

it("hexToRgb переводит HEX в компоненты 0..1", () => {
  expect(hexToRgb("#ffffff")).toEqual([1, 1, 1]);
  expect(hexToRgb("#000000")).toEqual([0, 0, 0]);
  expect(hexToRgb("2a2420")).toEqual([42 / 255, 36 / 255, 32 / 255]);
});
```

Create `tests/e2e/silk.spec.ts`:

```ts
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
  await expect(page.locator("#top canvas")).toHaveCount(webgl ? 1 : 0, { timeout: 10_000 });
  await expect(page.locator("#top img")).toHaveCount(1);
  await page.waitForTimeout(1000);
  expect(errors).toEqual([]);
});
```

Append to `tests/e2e/reduced.spec.ts`:

```ts
test("при reduced motion вместо WebGL — фото", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#top canvas")).toHaveCount(0);
  await expect(page.locator("#top img")).toHaveCount(1);
});
```

Run: `pnpm test && pnpm test:e2e`
Expected: FAIL — `@/lib/color` не найден; на десктопе в `#top` нет `canvas`.

- [ ] **Step 2: Цвета и шейдер**

Create `src/lib/color.ts`:

```ts
export function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}
```

Create `src/components/three/shader.ts`:

```ts
export const silkVertex = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const silkFragment = /* glsl */ `
varying vec2 vUv;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uRes;
uniform vec3 uLight;
uniform vec3 uBase;
uniform vec3 uShadow;
uniform vec3 uGold;

float folds(vec2 p, float t) {
  float v = sin(p.x * 2.2 + t * 0.6 + sin(p.y * 1.7 + t * 0.3) * 1.6);
  v += 0.6 * sin(p.y * 3.1 - t * 0.4 + sin(p.x * 2.3 - t * 0.2) * 1.2);
  v += 0.35 * sin((p.x + p.y) * 4.3 + t * 0.5);
  return v;
}

void main() {
  vec2 p = vUv * vec2(uRes.x / uRes.y, 1.0) * 1.6;
  p += (uMouse - 0.5) * 0.6 * smoothstep(0.9, 0.0, distance(vUv, uMouse));
  float h = folds(p, uTime);
  float e = 0.01;
  float dx = folds(p + vec2(e, 0.0), uTime) - h;
  float dy = folds(p + vec2(0.0, e), uTime) - h;
  vec3 normal = normalize(vec3(-dx / e * 0.08, -dy / e * 0.08, 1.0));
  vec3 lightDir = normalize(vec3(-0.4, 0.6, 0.7));
  float diffuse = clamp(dot(normal, lightDir), 0.0, 1.0);
  float specular = pow(clamp(dot(reflect(-lightDir, normal), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 24.0);
  vec3 color = mix(uBase, uLight, diffuse);
  color = mix(color, uShadow, smoothstep(0.55, 0.0, diffuse) * 0.5);
  color += uGold * specular * 0.35;
  gl_FragColor = vec4(color, 1.0);
}
`;
```

- [ ] **Step 3: Канвас и переключатель**

Create `src/components/three/SilkCanvas.tsx`:

```tsx
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { type ShaderMaterial, Vector2, Vector3 } from "three";
import { hexToRgb } from "@/lib/color";
import { silkFragment, silkVertex } from "./shader";

const color = (hex: string) => new Vector3(...hexToRgb(hex));

function SilkPlane() {
  const material = useRef<ShaderMaterial>(null);
  const pointer = useRef(new Vector2(0.5, 0.5));
  const size = useThree((state) => state.size);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uRes: { value: new Vector2(1, 1) },
      uLight: { value: color("#f7f3ec") },
      uBase: { value: color("#e6dccf") },
      uShadow: { value: color("#d4aa78") },
      uGold: { value: color("#e8c98a") },
    }),
    [],
  );

  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame((_, delta) => {
    const current = material.current;
    if (!current) return;
    current.uniforms.uTime.value += delta * 0.6;
    current.uniforms.uMouse.value.lerp(pointer.current, 0.05);
    current.uniforms.uRes.value.set(size.width, size.height);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={silkVertex}
        fragmentShader={silkFragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function SilkCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 animate-[fade-in_1.6s_ease_forwards] opacity-0">
      <Canvas
        flat
        linear
        dpr={[1, 1.5]}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: false, powerPreference: "low-power" }}
      >
        <SilkPlane />
      </Canvas>
    </div>
  );
}
```

Create `src/components/three/SilkHero.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { ImageRef } from "@/content/types";
import { readSilkEnv, shouldRenderSilk } from "@/lib/device";

const SilkCanvas = dynamic(() => import("./SilkCanvas"), { ssr: false });

export function SilkHero({ image }: { image: ImageRef }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(shouldRenderSilk(readSilkEnv()));
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <Image src={image.src} alt="" fill preload sizes="100vw" className="object-cover" />
      {enabled ? <SilkCanvas /> : null}
      <div className="absolute inset-0 bg-linear-to-t from-ivory via-ivory/50 to-ivory/10" />
    </div>
  );
}
```

- [ ] **Step 4: Подключить к первому экрану**

In `src/components/sections/Hero.tsx`: remove `import Image from "next/image";`, add `import { SilkHero } from "@/components/three/SilkHero";` and replace the background block

```tsx
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image src={hero.image.src} alt="" fill preload sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-ivory via-ivory/50 to-ivory/10" />
      </div>
```

with

```tsx
      <SilkHero image={hero.image} />
```

- [ ] **Step 5: Убедиться, что тесты проходят**

Run: `pnpm format && pnpm lint && pnpm test && pnpm test:e2e`
Expected: PASS. Если `silk.spec.ts` ловит ошибку компиляции шейдера в консоли, исправить GLSL и запустить снова.

- [ ] **Step 6: Визуальная проверка**

`pnpm dev`, десктоп. Шёлк должен медленно переливаться в тонах `ivory` / `sand` / `caramel` с золотыми бликами и мягко реагировать на курсор. Заголовок поверх должен читаться. Если слишком контрастно — уменьшить множитель `0.08` у нормали или `0.35` у блика.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add WebGL silk hero with static image fallback

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: SEO — метаданные, robots, sitemap, иконка

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/icon.svg`
- Delete: `src/app/favicon.ico`
- Test: `tests/e2e/seo.spec.ts`

**Interfaces:**
- Consumes: `site.url`, `site.seo`, `site.brand`.
- Produces: `/robots.txt`, `/sitemap.xml`, `/icon.svg`, OG- и Twitter-мета.

- [ ] **Step 1: Написать падающий тест**

Create `tests/e2e/seo.spec.ts`:

```ts
import { expect, test } from "@playwright/test";
import { site } from "@/content/site";

test("мета-теги для соцсетей и поисковиков", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", site.seo.description);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    `${site.url}${site.seo.ogImage.src}`,
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "ru_RU");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`^${site.url}/?$`));
  await expect(page.locator('link[rel="icon"]').first()).toHaveAttribute("href", /icon\.svg/);
});

test("robots.txt и sitemap.xml", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain(`Sitemap: ${site.url}/sitemap.xml`);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(`<loc>${site.url}</loc>`);
});
```

Run: `pnpm test:e2e seo`
Expected: FAIL — нет `og:image`, `/robots.txt` отдаёт 404.

- [ ] **Step 2: Метаданные**

In `src/app/layout.tsx` replace `export const metadata …` with:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.seo.title,
  description: site.seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: site.brand.name,
    title: site.seo.title,
    description: site.seo.description,
    images: [{ url: site.seo.ogImage.src, width: 1200, height: 630, alt: site.seo.ogImage.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
    images: [site.seo.ogImage.src],
  },
};
```

- [ ] **Step 3: robots, sitemap, иконка**

Create `src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
```

Create `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
```

Create `src/app/icon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#B8893F"/>
      <stop offset="0.5" stop-color="#E8C98A"/>
      <stop offset="1" stop-color="#A67C3A"/>
    </linearGradient>
  </defs>
  <rect width="100" height="120" rx="20" fill="#2A2420"/>
  <g fill="none" stroke="url(#g)" stroke-width="5" stroke-linecap="round">
    <circle cx="50" cy="68" r="40"/>
    <path d="M50 18C70 29 70 47 50 58S30 90 50 104"/>
  </g>
  <circle cx="50" cy="10" r="5" fill="url(#g)"/>
</svg>
```

```bash
git rm -q src/app/favicon.ico
```

- [ ] **Step 4: Убедиться, что тесты проходят**

Run: `pnpm format && pnpm lint && pnpm test:e2e`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add SEO metadata, robots, sitemap and brand icon

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Docker-образ

**Files:**
- Modify: `next.config.ts`
- Create: `src/app/api/health/route.ts`, `Dockerfile`, `.dockerignore`
- Test: `tests/e2e/health.spec.ts`

**Interfaces:**
- Produces: `GET /api/health → 200 {"status":"ok"}`; образ, который слушает `PORT=3000` на `0.0.0.0`.

- [ ] **Step 1: Написать падающий тест**

Create `tests/e2e/health.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("healthcheck отвечает ok", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ status: "ok" });
});
```

Run: `pnpm test:e2e health`
Expected: FAIL — 404.

- [ ] **Step 2: Роут и standalone-сборка**

Create `src/app/api/health/route.ts`:

```ts
export function GET() {
  return Response.json({ status: "ok" });
}
```

Replace `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
};

export default nextConfig;
```

Run: `pnpm test:e2e`
Expected: PASS — все спеки (`next start` со standalone может выдать предупреждение, сервер при этом работает).

- [ ] **Step 3: Dockerfile и .dockerignore**

Create `Dockerfile`:

```dockerfile
# syntax=docker/dockerfile:1
ARG NODE_IMAGE=node:24-alpine

FROM ${NODE_IMAGE} AS base
RUN npm install -g corepack@latest && corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "server.js"]
```

Create `.dockerignore`:

```
node_modules
.next
.git
.github
docs
tests
playwright-report
test-results
blob-report
.lighthouse
.env*
Dockerfile
.dockerignore
```

- [ ] **Step 4: Собрать и проверить образ локально**

```bash
docker build -t svetara:local .
docker run -d --rm --name svetara-test -p 3300:3000 svetara:local
for i in $(seq 1 30); do curl -sf http://localhost:3300/api/health && break; sleep 1; done; echo
curl -s -o /dev/null -w "home %{http_code}\n" http://localhost:3300/
curl -s -o /dev/null -w "image %{http_code} %{content_type}\n" -H "Accept: image/webp" "http://localhost:3300/_next/image?url=%2Fimages%2Fhero-silk.jpg&w=640&q=75"
for i in $(seq 1 20); do s=$(docker inspect --format '{{.State.Health.Status}}' svetara-test); [ "$s" = healthy ] && break; sleep 3; done; echo "health: $s"
docker image ls svetara:local --format "size: {{.Size}}"
docker stop svetara-test
```

Expected:
```
{"status":"ok"}
home 200
image 200 image/webp
health: healthy
size: <~200MB
```

Если `/_next/image` отдаёт 500 с ошибкой про `sharp`, добавить в `next.config.ts` `outputFileTracingIncludes: { "/*": ["node_modules/sharp/**/*", "node_modules/@img/**/*"] }` и пересобрать образ.

- [ ] **Step 5: Commit**

```bash
pnpm format && pnpm lint
git add -A
git commit -m "build: add standalone Docker image with healthcheck

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: GitHub Actions — проверки, сборка, публикация в GHCR

**Files:**
- Create: `.github/workflows/docker.yml`

**Interfaces:**
- Consumes: скрипты `pnpm test`, `pnpm build`, `biome ci`, `Dockerfile`.
- Produces: образ `ghcr.io/<owner в нижнем регистре>/svetara` с тегами `latest` + `sha-<short>` (main), `X.Y.Z` + `X.Y` (теги `vX.Y.Z`), `pr-N` (собирается, не публикуется).

- [ ] **Step 1: Проверить актуальные мажорные версии actions**

```bash
for a in actions/checkout actions/setup-node pnpm/action-setup docker/setup-buildx-action docker/login-action docker/metadata-action docker/build-push-action; do echo "$a $(gh api repos/$a/releases/latest --jq .tag_name)"; done
```

Если мажорная версия новее указанной ниже — подставить её в workflow.

- [ ] **Step 2: Workflow**

Create `.github/workflows/docker.yml`:

```yaml
name: Docker

on:
  push:
    branches: [main]
    tags: ["v*"]
  pull_request:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  REGISTRY: ghcr.io

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v5
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec biome ci
      - run: pnpm test
      - run: pnpm build

  docker:
    needs: check
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v5

      - name: Image name in lowercase
        id: image
        run: echo "name=${REGISTRY}/${GITHUB_REPOSITORY_OWNER,,}/svetara" >> "$GITHUB_OUTPUT"

      - uses: docker/setup-buildx-action@v3

      - if: github.event_name != 'pull_request'
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ steps.image.outputs.name }}
          tags: |
            type=raw,value=latest,enable={{is_default_branch}}
            type=sha,prefix=sha-,enable=${{ github.ref == 'refs/heads/main' }}
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=ref,event=pr

      - uses: docker/build-push-action@v6
        with:
          context: .
          platforms: linux/amd64
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

- [ ] **Step 3: Проверить workflow линтером**

Run: `docker run --rm -v "$PWD:/repo" -w /repo rhysd/actionlint:latest -color`
Expected: пустой вывод, код 0.

Run: `pnpm exec biome ci && pnpm test && pnpm build`
Expected: те же команды, что выполнит job `check`, проходят локально.

- [ ] **Step 4: Commit**

```bash
git add .github
git commit -m "ci: build and publish Docker image to GHCR

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 14: Финальная проверка и README

**Files:**
- Create: `README.md` (заменить шаблонный)

- [ ] **Step 1: README**

Replace `README.md`:

````markdown
# SVETARA — лендинг

Лендинг нутрициолога и персонального тренера. Next.js 16, Tailwind v4, GSAP, Lenis, Three.js.

## Запуск

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Как менять контент

- Тексты, цены, контакты, ссылки на мессенджеры — `src/content/site.ts`.
  `*слово*` в заголовках выделяется курсивом золотом.
- Фото — файлы в `public/images/` с теми же именами. Перекачать заглушки: поправить `scripts/images.json`, затем `pnpm images`.
- Когда появятся свои фото, выключите тёплый фильтр: `media.warmFilter: false`.

## Проверки

```bash
pnpm lint         # Biome
pnpm test         # Vitest
pnpm test:e2e     # Playwright: desktop, mobile, reduced motion
```

## Docker

```bash
docker build -t svetara .
docker run -p 3000:3000 svetara
```

При push в `main` или теге `v*` GitHub Actions собирает образ и публикует его в `ghcr.io/<owner>/svetara`.
````

- [ ] **Step 2: Полный прогон проверок**

Run: `pnpm format && pnpm lint && pnpm test && pnpm test:e2e`
Expected: всё зелёное во всех трёх проектах Playwright.

- [ ] **Step 3: Lighthouse (мобильный профиль)**

```bash
pnpm build && (pnpm start --port 3200 > /tmp/svetara-start.log 2>&1 &)
for i in $(seq 1 30); do curl -sf http://localhost:3200/api/health >/dev/null && break; sleep 1; done
mkdir -p .lighthouse
npx -y lighthouse@latest http://localhost:3200 --only-categories=performance,accessibility,seo --quiet --chrome-flags="--headless=new" --output=json --output-path=.lighthouse/mobile.json
node -e 'const r=require("./.lighthouse/mobile.json");for(const [k,v] of Object.entries(r.categories))console.log(k,Math.round(v.score*100));console.log("LCP",r.audits["largest-contentful-paint"].displayValue,"TBT",r.audits["total-blocking-time"].displayValue)'
pkill -f "next start --port 3200"
```

Expected: performance ≥ 85, accessibility ≥ 95, seo ≥ 95.

Если performance < 85 и основная причина — TBT от чанка three.js: в `shouldRenderSilk` отключить шёлк для всех `coarsePointer`. Обновить тест «мощное тач-устройство» в `tests/unit/device.test.ts` на ожидание `false` и запустить замер ещё раз. Если accessibility < 95 — исправить элементы из `r.audits` со `score < 1` (обычно это контраст или подписи).

- [ ] **Step 4: Визуальная проверка по брендбуку**

Снять полностраничные скриншоты на десктопе (1440×900) и мобильном (390×844) после полной прокрутки (чтобы сработали все появления) и посмотреть их. Сверить с брендбуком: палитра, арки, тонкие линии, воздух между блоками, золото только как акцент. Явные расхождения исправить отдельными коммитами `fix:` / `style:`.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: add README with content editing and deploy notes

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```
