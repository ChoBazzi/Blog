/* eslint-disable @next/next/no-html-link-for-pages */

import { categoryItems } from "@/lib/navigation";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/posts", label: "전체 게시글" },
  { href: "/projects", label: "프로젝트" },
  { href: "/dev-log", label: "Dev Log" },
  { href: "/notes", label: "공부 노트" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Home">
        <span className="brand-mark" aria-hidden="true">
          B
        </span>
        <span>bazzi.docs</span>
      </a>
      <nav className="nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
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
              <strong>조현식</strong>
              <span>백엔드 개발자 지망생</span>
            </div>
            <a href="/about">About</a>
          </div>
        </div>
      </details>
    </header>
  );
}
