export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <section className="page-shell">
      <p className="eyebrow">Contact</p>
      <h1>연락처와 외부 링크</h1>
      <div className="link-panel">
        <a href="mailto:hyeon.s2.dev@gmail.com">hyeon.s2.dev@gmail.com</a>
        <a href="https://github.com/ChoBazzi">GitHub</a>
        <a href="https://www.linkedin.com/in/chobazzi/">LinkedIn</a>
      </div>
    </section>
  );
}
