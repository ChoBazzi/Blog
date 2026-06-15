export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Bazzi&apos;s Devlog</strong>
        <p>프로젝트 문제 해결 과정, 회고, 공부 노트를 기록합니다.</p>
      </div>
      <nav aria-label="Footer links">
        <a href="https://github.com/ChoBazzi">GitHub</a>
        <a href="mailto:hyeon.s2.dev@gmail.com">Email</a>
        <a href="/about">About</a>
      </nav>
      <small>© 2026 Bazzi. Built with Next.js and Markdown.</small>
    </footer>
  );
}
