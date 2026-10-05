import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { INTRO_STORAGE_KEY } from "@/lib/intro";
// Шрифты лежат в проекте (Fontsource): сборка не зависит от ответа Google Fonts,
// который на CI отдаёт ссылки с query-строкой и ломает Turbopack.
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/300-italic.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource-variable/manrope/index.css";
import "./globals.css";

const introBoot = `try{var d=document.documentElement;if(sessionStorage.getItem("${INTRO_STORAGE_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.intro="skip"}}catch(e){}`;

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
    images: [
      {
        url: site.seo.ogImage.src,
        width: 1200,
        height: 630,
        alt: site.seo.ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
    images: [site.seo.ogImage.src],
  },
};

export const viewport: Viewport = { themeColor: "#f7f3ec" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: статический загрузочный скрипт без пользовательских данных */}
        <script dangerouslySetInnerHTML={{ __html: introBoot }} />
      </head>
      <body className="min-h-svh bg-ivory font-sans text-espresso antialiased">
        {children}
      </body>
    </html>
  );
}
