import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { sora } from "@/fonts/sora";
import { fraunces } from "@/fonts/fraunces";
import { SITE_URL } from "@/lib/supabase/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1224" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} ${sora.variable} ${fraunces.variable}`}>
      <head>
        {/* Enable motion before first paint, unless the visitor prefers reduced motion. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("motion-ok")}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
