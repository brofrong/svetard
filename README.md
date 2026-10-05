# SVETARA — лендинг

Лендинг нутрициолога и персонального тренера. Next.js 16 на Bun, Tailwind v4, GSAP, Lenis, Three.js.

## Запуск

```bash
bun install
bun run dev          # http://localhost:3000
```

## Как менять контент

- Тексты, цены, контакты, ссылки на мессенджеры — `src/content/site.ts`.
  `*слово*` в заголовках выделяется курсивом золотом.
- Фото — файлы в `public/images/` с теми же именами. Перекачать заглушки: поправить `scripts/images.json`, затем `bun run images`.
- Когда появятся свои фото, выключите тёплый фильтр: `media.warmFilter: false`.

## Проверки

```bash
bun run lint         # Biome
bun run test         # Vitest
bun run test:e2e     # Playwright: desktop, mobile, reduced motion
```

## Docker

```bash
docker build -t svetara .
docker run -p 3000:3000 svetara
```

При push в `main` или теге `v*` GitHub Actions собирает образ и публикует его в `ghcr.io/<owner>/svetara`.
