/* eslint-disable @next/next/no-html-link-for-pages */

import { PostList } from "@/components/PostList";
import { getCollection } from "@/lib/content";

const featuredExperiences = [
  {
    href: "/projects/2026-05-29-bizkit-final-ai-architecture",
    label: "AI Backend",
    title: "BizKit AI 서버 아키텍처",
    problem: "Diffusion, LLM, Embedding 기능을 도메인 서버와 분리해야 했다.",
    role: "FastAPI 오케스트레이터, 비동기 작업 구조, 모델 선택 근거를 설계했다.",
    result: "Redis Streams, RunPod, vLLM, Milvus 기반 AI 워크플로로 정리했다.",
  },
  {
    href: "/posts/2026-07-01-church-app-backend-responsibility-shift",
    label: "Mobile / Spring Backend",
    title: "상3동성당 앱 v1 출시와 v2 구조 개선",
    problem: "종이 주보 접근성 문제에서 시작해, 앱이 날짜 계산과 게시 상태까지 들고 있는 구조로 확장 한계가 생겼다.",
    role: "v1은 React Native와 Django로 출시하고, v2는 Spring Boot 중심으로 서버 책임을 다시 나눴다.",
    result: "Play Store 실사용자 130명 경험을 바탕으로 주보, 전례력, 공지 확장 기반을 정리했다.",
  },
  {
    href: "/projects/2026-05-09-django-crawling-kakaotalk-bot",
    label: "Django / Async Jobs",
    title: "크롤링 서버와 카카오톡 알림 봇",
    problem: "게임 커뮤니티 공지를 사람이 반복해서 확인해야 해 중요한 공지를 놓치기 쉬웠다.",
    role: "Django 서버, Celery/Redis 비동기 작업, MySQL 저장, Nginx/uWSGI 배포를 직접 구성했다.",
    result: "크롤링과 알림 전송을 요청 흐름에서 분리하며 24시간 동작하는 자동화 구조를 만들었다.",
  },
];

const treeItems: Array<{
  href: string;
  label: string;
  imageSrc: string;
  className?: string;
}> = [
  {
    href: "/",
    label: "Home",
    imageSrc: "/icons/home.png",
  },
  {
    href: "/posts",
    label: "전체 글",
    imageSrc: "/icons/icon_p.png",
  },
  {
    href: "/projects",
    label: "프로젝트",
    imageSrc: "/icons/icon_p.png",
  },
  {
    href: "/dev-log",
    label: "개발 기록",
    imageSrc: "/icons/icon_d.png",
  },
  {
    href: "/notes",
    label: "공부 노트",
    imageSrc: "/icons/icon_n.png",
  },
  {
    href: "/kakaotech-bootcamp",
    label: "카카오테크 부트캠프",
    className: "tree-separated",
    imageSrc: "/icons/katebu.webp",
  },
  {
    href: "/hobby",
    label: "이것저것",
    className: "tree-separated tree-group",
    imageSrc: "/icons/icon_coffee.png",
  },
];

function ProfileCard({ className = "" }: { className?: string }) {
  return (
    <aside className={["profile-card", className].filter(Boolean).join(" ")} aria-label="Profile">
      <img className="profile-avatar" src="/profile.jpg" alt="조현식 프로필 사진" aria-hidden="true"></img>
      <h2>조현식(Bazzi)</h2>
      <p>사용자 흐름과 운영 환경을 함께 보는 백엔드 주니어 개발자입니다.</p>

      <a className="profile-button" href="/about">
        About
      </a>

      <div className="profile-link-list" aria-label="External links">
        <a href="https://github.com/ChoBazzi">GitHub</a>
        <a href="https://www.linkedin.com/in/chobazzi/">LinkedIn</a>
      </div>

      <dl className="profile-meta">
        <div>
          <dt>Focus</dt>
          <dd>Backend, AI workflow, Deployment</dd>
        </div>
        <div>
          <dt>Stack</dt>
          <dd>Spring Boot, FastAPI, Django</dd>
        </div>
        <div>
          <dt>Writing</dt>
          <dd>Project decisions and retrospectives</dd>
        </div>
      </dl>
    </aside>
  );
}

export default async function Home() {
  const [projects, posts, notes] = await Promise.all([
    getCollection("projects"),
    getCollection("blog"),
    getCollection("notes"),
  ]);
  const retrospectivePosts = posts.filter((post) => post.category !== "project");

  return (
    <>
      <section className="home-shell">
        <aside className="home-tree" aria-label="Repository tree">
          <div className="panel-heading">
            <span>Repository</span>
          </div>
          <nav className="tree-nav">
            {treeItems.map((item) => (
              <a
                key={item.href}
                className={[item.href === "/" ? "tree-root" : "", item.className ?? ""]
                  .filter(Boolean)
                  .join(" ")}
                href={item.href}
              >
                <img className="tree-item-icon tree-item-image" src={item.imageSrc} alt="" />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="tree-section">
            <p className="sidebar-label">Recent projects</p>
            {projects.slice(0, 4).map((post) => (
              <a key={post.slug} href={`/projects/${post.slug}`}>
                {post.title}
              </a>
            ))}
          </div>
        </aside>

        <div className="home-main">
          <section className="readme-panel" aria-labelledby="home-readme-title">
            <div className="panel-heading">
              <span>Recruiter snapshot</span>
            </div>
            <div className="readme-body">
              <p className="eyebrow">Backend / AI Server Junior Developer</p>
              <h1 id="home-readme-title">운영 중 바뀌는 문제를 서버 구조로 풀어내는 개발자</h1>
              <p>
                Spring Boot, FastAPI, React Native 기반 프로젝트를 만들며 API 설계,
                비동기 AI 워크플로, 모바일 앱 백엔드 책임 분리를 기록합니다. 채용담당자가
                빠르게 판단할 수 있도록 문제, 역할, 결과를 먼저 보여주는 포트폴리오입니다.
              </p>

              <ul className="recruiter-signal-list" aria-label="Recruiter highlights">
                <li>희망 포지션: 백엔드 / AI 백엔드 / 서버 개발</li>
                <li>대표 경험: AI 서버 설계, 성당 앱 백엔드 구조 개선, Play Store 배포</li>
                <li>글쓰기 기준: 기술 선택보다 문제 정의와 책임 경계를 먼저 설명</li>
              </ul>


              <div className="readme-grid" aria-label="Portfolio summary">
              
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-heading">
              <p className="eyebrow">Representative Work</p>
              <h2>대표 경험</h2>
              <a href="/projects">View all</a>
            </div>
            <div className="featured-experience-grid">
              {featuredExperiences.map((item) => (
                <article className="featured-experience-card" key={item.href}>
                  <a href={item.href}>
                    <span>{item.label}</span>
                    <h3>{item.title}</h3>
                    <dl>
                      <div>
                        <dt>문제</dt>
                        <dd>{item.problem}</dd>
                      </div>
                      <div>
                        <dt>역할</dt>
                        <dd>{item.role}</dd>
                      </div>
                      <div>
                        <dt>결과</dt>
                        <dd>{item.result}</dd>
                      </div>
                    </dl>
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section className="section two-column">
            <div>
              <div className="section-heading">
                <p className="eyebrow">Dev log</p>
                <h2>개발 기록</h2>
                <a href="/dev-log">View all</a>
              </div>
              <PostList posts={retrospectivePosts.slice(0, 2)} collection="blog" />
            </div>
            <div>
              <div className="section-heading">
                <p className="eyebrow">Study</p>
                <h2>공부 노트</h2>
              </div>
              <PostList posts={notes.slice(0, 2)} collection="notes" />
            </div>
          </section>
        </div>

        <ProfileCard className="profile-card-desktop" />
      </section>

      <details className="profile-drawer">
        <summary aria-label="프로필 열기">Profile</summary>
        <ProfileCard />
      </details>
    </>
  );
}
