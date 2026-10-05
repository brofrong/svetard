import { mkdir, readFile, writeFile } from "node:fs/promises";

const manifest = JSON.parse(
  await readFile(new URL("./images.json", import.meta.url), "utf8"),
);
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
  const params = new URLSearchParams({
    auto: "compress",
    cs: "tinysrgb",
    w: String(image.width),
  });
  if (image.height) {
    params.set("h", String(image.height));
    params.set("fit", "crop");
  }
  const url = `https://images.pexels.com/photos/${image.pexelsId}/pexels-photo-${image.pexelsId}.jpeg?${params}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${image.file}: HTTP ${response.status}`);
  await writeFile(
    new URL(image.file, outDir),
    Buffer.from(await response.arrayBuffer()),
  );
  credits.push(
    `- ${image.file} — https://www.pexels.com/photo/${image.pexelsId}/`,
  );
  console.log(`✓ ${image.file}`);
}

await writeFile(new URL("CREDITS.md", outDir), `${credits.join("\n")}\n`);
