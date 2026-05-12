/* eslint-disable @next/next/no-html-link-for-pages */

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
    </header>
  );
}
