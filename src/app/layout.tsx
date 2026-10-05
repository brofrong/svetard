import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { INTRO_STORAGE_KEY } from "@/lib/intro";
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

const introBoot = `try{var d=document.documentElement;if(sessionStorage.getItem("${INTRO_STORAGE_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.intro="skip"}}catch(e){}`;

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
