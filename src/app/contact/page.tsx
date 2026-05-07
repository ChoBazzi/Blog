export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <section className="page-shell">
      <p className="eyebrow">Contact</p>
      <h1>연락처와 외부 링크</h1>
      <div className="link-panel">
        <a href="mailto:you@example.com">you@example.com</a>
        <a href="https://github.com/your-id">GitHub</a>
        <a href="https://www.linkedin.com/in/your-id">LinkedIn</a>
      </div>
    </section>
  );
}
