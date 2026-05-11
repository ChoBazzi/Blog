/* eslint-disable @next/next/no-html-link-for-pages */

import { PostList } from "@/components/PostList";
import { getCollection } from "@/lib/content";

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
            <a className="tree-root" href="/">
              portfolio-blog
            </a>
            <a href="/blog">
              <span>blog</span>
            </a>
            <a href="/notes">
              <span>notes</span>
            </a>
            <a href="/projects">
              <span>projects</span>
            </a>
            <a href="/about">
              <span>about</span>
            </a>
            <a href="/contact">
              <span>contact</span>
            </a>
          </nav>

          <div className="tree-section">
            <p className="sidebar-label">Recent projects</p>
            {projectPosts.slice(0, 4).map((post) => (
              <a key={post.slug} href={`/blog/${post.slug}`}>
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
              <a href="/blog">View all</a>
            </div>
            <PostList
              posts={projectPosts.length > 0 ? projectPosts : projects.slice(0, 3)}
              collection={projectPosts.length > 0 ? "blog" : "projects"}
            />
          </section>

          <section className="section two-column">
            <div>
              <div className="section-heading">
                <p className="eyebrow">Retrospective</p>
                <h2>최근 회고</h2>
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

        <aside className="profile-card" aria-label="Profile">
          <div className="profile-avatar" aria-hidden="true">
            B
          </div>
          <h2>조현식</h2>
          <p>프로젝트를 만들고, 배포하고, 회고로 남기는 개발자 지망생입니다.</p>

          <a className="profile-button" href="/contact">
            Contact
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
      </section>
    </>
  );
}
