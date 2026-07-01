import Link from "next/link";

export const metadata = {
  title: "About / Contact",
};

export default function AboutPage() {
  return (
    <section className="page-shell">
      <p className="eyebrow">About / Contact</p>
      <h1>백엔드와 AI 서버 흐름을 직접 만들고 기록하는 주니어 개발자</h1>
      <p className="about-lead">
        희망 포지션은 백엔드, AI 백엔드, 서버 개발입니다. 기능을 빠르게 붙이는 것보다
        데이터와 운영 책임이 어디에 있어야 하는지 먼저 고민합니다.
      </p>
      <div className="about-action-list" aria-label="Contact and profile links">
        <a href="mailto:hyeon.s2.dev@gmail.com">Email</a>
        <a href="https://github.com/ChoBazzi">GitHub</a>
        <a href="https://www.linkedin.com/in/chobazzi/">LinkedIn</a>
        <a href="mailto:hyeon.s2.dev@gmail.com?subject=Resume%20request">Resume 요청</a>
      </div>
      <div className="content-grid">
        <div>
          <h2>핵심 역량</h2>
          <ul className="plain-list">
            <li>Spring Boot 기반 도메인 API와 서버 책임 분리</li>
            <li>FastAPI, Redis Streams, RunPod 기반 AI 작업 흐름 설계</li>
            <li>React Native 앱에서 필요한 서버 API와 사용자 흐름 정리</li>
          </ul>
        </div>
        <div>
          <h2>현재 스택</h2>
          <ul className="plain-list">
            <li>Backend: Spring Boot, Django, FastAPI</li>
            <li>Data: PostgreSQL, Redis, Milvus</li>
            <li>Frontend: React, React Native, Next.js</li>
            <li>Deploy: Docker, Vercel, NAS reverse proxy</li>
          </ul>
        </div>
      </div>

      <div className="content-grid about-detail-grid">
        <div>
          <h2>대표 프로젝트</h2>
          <ul className="plain-list">
            <li>
              <Link href="/projects/2026-05-29-bizkit-final-ai-architecture">BizKit AI 서버 아키텍처</Link>
            </li>
            <li>
              <Link href="/posts/2026-07-01-church-app-backend-responsibility-shift">
                상3동성당 앱 v1 출시와 v2 구조 개선
              </Link>
            </li>
            <li>
              <Link href="/projects/2026-05-09-django-crawling-kakaotalk-bot">
                Django 크롤링 서버와 카카오톡 알림 봇
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>기록 방식</h2>
          <p>
            프로젝트 글은 문제, 제약, 맡은 역할, 구현, 검증, 아쉬운 점 순서로 정리하려고 합니다.
            사용 기술을 나열하기보다 왜 그 선택을 했는지와 어떤 한계가 남았는지를 함께 남깁니다.
          </p>
        </div>
      </div>

      <div className="link-panel">
        <h2>연락처와 외부 링크</h2>
        <a href="mailto:hyeon.s2.dev@gmail.com">hyeon.s2.dev@gmail.com</a>
        <a href="https://github.com/ChoBazzi">GitHub</a>
        <a href="https://www.linkedin.com/in/chobazzi/">LinkedIn</a>
        <a href="mailto:hyeon.s2.dev@gmail.com?subject=Resume%20request">Resume 요청</a>
      </div>
    </section>
  );
}
