export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <section className="page-shell">
      <p className="eyebrow">About</p>
      <h1>문제를 끝까지 추적하고, 기록으로 복기하는 개발자</h1>
      <div className="content-grid">
        <div>
          <h2>방향성</h2>
          <p>
            사용자 흐름과 운영 환경을 함께 고려하는 웹 개발자를 목표로 합니다. 작은 기능도
            왜 필요한지, 어디에서 깨질 수 있는지, 다음 사람이 어떻게 유지보수할지까지
            생각하며 구현합니다.
          </p>
        </div>
        <div>
          <h2>현재 스택</h2>
          <ul className="plain-list">
            <li>Frontend: </li>
            <li>Content: </li>
            <li>Deploy: </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
