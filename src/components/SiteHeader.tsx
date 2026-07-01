/* eslint-disable @next/next/no-html-link-for-pages */

import { categoryItems } from "@/lib/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "/projects", label: "프로젝트" },
  { href: "/dev-log", label: "개발 기록" },
  { href: "/kakaotech-bootcamp", label: "카카오테크 부트캠프" },
  { href: "/about", label: "About" },
  { href: "https://github.com/ChoBazzi", label: "GitHub" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Home">
        <span className="brand-mark" aria-hidden="true">
          <img src="/icons/logo.PNG" alt="" />
        </span>
      </a>
      <div className="header-actions">
        <nav className="nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <ThemeToggle />
      </div>
      <details className="mobile-category-menu">
        <summary aria-label="메뉴 열기">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </summary>
        <div className="mobile-menu-panel">
          <nav aria-label="Mobile categories">
            {categoryItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mobile-menu-profile">
            <img src="/profile.jpg" alt="" />
            <div>
              <strong>조현식(Bazzi)</strong>
              <span>백엔드 주니어 개발자</span>
            </div>
            <a href="/about">About</a>
          </div>
        </div>
      </details>
    </header>
  );
}
