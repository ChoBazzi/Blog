import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Bazzi's Devlog",
    template: "%s | Bazzi's Devlog",
  },
  description: "신입 개발자 포트폴리오, 프로젝트 기록, 회고, 공부 노트를 정리하는 개인 웹페이지입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = window.localStorage.getItem("theme");
                const theme = stored === "dark" || stored === "light"
                  ? stored
                  : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                document.documentElement.dataset.theme = theme;
                document.documentElement.style.colorScheme = theme;
              } catch {
                document.documentElement.dataset.theme = "light";
              }
            `,
          }}
        />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
