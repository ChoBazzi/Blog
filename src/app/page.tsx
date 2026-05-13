/* eslint-disable @next/next/no-html-link-for-pages */

import { PostList } from "@/components/PostList";
import { getCollection } from "@/lib/content";

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
    label: "전체 게시글",
    imageSrc: "/icons/icon_p.png",
  },
  {
    href: "/projects",
    label: "프로젝트",
    imageSrc: "/icons/icon_p.png",
  },
  {
    href: "/dev-log",
    label: "Dev Log",
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
      <p>여러가지 만들어보는 백엔드 개발자 지망생입니다.</p>

      <a className="profile-button" href="/about">
        About
      </a>

      <dl className="profile-meta">
        <div>
          <dt>Focus</dt>
          <dd>Web, Backend, AI, Deployment</dd>
        </div>
        <div>
          <dt>Stack</dt>
          <dd>Next.js, TypeScript, Django, Spring Boot</dd>
        </div>
        <div>
          <dt>Writing</dt>
          <dd>Projects, retrospectives, study notes</dd>
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
  const projectPosts = posts.filter((post) => post.category === "project");
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
            {projectPosts.slice(0, 4).map((post) => (
              <a key={post.slug} href={`/posts/${post.slug}`}>
                {post.title}
              </a>
            ))}
          </div>
        </aside>

        <div className="home-main">
          <section className="readme-panel" aria-labelledby="home-readme-title">
            <div className="panel-heading">
              <span>Profile overview</span>
            </div>
            <div className="readme-body">
              <p className="eyebrow">Developer Portfolio</p>
              <h1 id="home-readme-title">문제 해결 과정을 기록하는 개발자</h1>
              <p>
                프로젝트에서 마주친 문제를 정리하고, 구현 과정과 회고를 Markdown으로
                남깁니다. 단순한 결과물보다 어떤 판단으로 문제를 해결했는지 보여주는
                포트폴리오를 목표 시작!
              </p>

              <div className="readme-grid" aria-label="Portfolio summary">
                <div>
                  <strong>Write</strong>
                  <span>Obsidian Markdown</span>
                </div>
                <div>
                  <strong>Build</strong>
                  <span>Next.js Static Pages</span>
                </div>
                <div>
                  <strong>Deploy</strong>
                  <span>Vercel / Docker NAS</span>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-heading">
              <p className="eyebrow">Pinned</p>
              <h2>프로젝트 글</h2>
              <a href="/posts">View all</a>
            </div>
            <PostList
              posts={projectPosts.length > 0 ? projectPosts : projects.slice(0, 3)}
              collection={projectPosts.length > 0 ? "blog" : "projects"}
            />
          </section>

          <section className="section two-column">
            <div>
              <div className="section-heading">
                <p className="eyebrow">Dev Log</p>
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
