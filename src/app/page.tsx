import Link from "next/link";
import { PostList } from "@/components/PostList";
import { getCollection } from "@/lib/content";

export default async function Home() {
  const [projects, posts, notes] = await Promise.all([
    getCollection("projects"),
    getCollection("blog"),
    getCollection("notes"),
  ]);

  return (
    <>
      <section className="docs-layout home-layout">
        <aside className="docs-sidebar" aria-label="Workspace navigation">
          <p className="sidebar-label">Workspace</p>
          <nav className="sidebar-nav">
            <Link href="/projects">Projects</Link>
            <Link href="/blog">Retrospectives</Link>
            <Link href="/notes">Study Notes</Link>
            <Link href="/about">About</Link>
          </nav>
        </aside>

        <div className="home-content">
          <section className="hero">
            <p className="eyebrow">Developer Knowledge Base</p>
            <h1>문제 해결 과정을 문서처럼 정리하는 포트폴리오</h1>
            <p>
              프로젝트, 회고, 공부 노트를 Markdown으로 관리하고 배포/운영 맥락까지 함께
              기록합니다.
            </p>
            <div className="quick-search" aria-label="Content map">
              <span>Search scope</span>
              <strong>projects / blog / notes / deployment</strong>
            </div>
          </section>

          <div className="doc-grid" aria-label="Primary sections">
            <Link className="doc-tile" href="/projects">
              <span>01</span>
              <strong>Projects</strong>
              <small>구현 기록과 운영 맥락</small>
            </Link>
            <Link className="doc-tile" href="/blog">
              <span>02</span>
              <strong>Retrospectives</strong>
              <small>문제 해결 회고</small>
            </Link>
            <Link className="doc-tile" href="/notes">
              <span>03</span>
              <strong>Study Notes</strong>
              <small>개념 정리와 학습 로그</small>
            </Link>
            <Link className="doc-tile" href="/contact">
              <span>04</span>
              <strong>Contact</strong>
              <small>외부 링크와 연락처</small>
            </Link>
          </div>

          <section className="section">
            <div className="section-heading">
              <p className="eyebrow">Featured</p>
              <h2>대표 프로젝트</h2>
              <Link href="/projects">View all</Link>
            </div>
            <PostList posts={projects.slice(0, 3)} collection="projects" />
          </section>

          <section className="section two-column">
            <div>
              <div className="section-heading">
                <p className="eyebrow">Retrospective</p>
                <h2>최근 회고</h2>
              </div>
              <PostList posts={posts.slice(0, 2)} collection="blog" />
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

        <aside className="toc home-toc" aria-label="System summary">
          <p className="sidebar-label">Stack</p>
          <dl className="property-list">
            <div>
              <dt>Write</dt>
              <dd>Obsidian Markdown</dd>
            </div>
            <div>
              <dt>Build</dt>
              <dd>Next.js Static Pages</dd>
            </div>
            <div>
              <dt>Deploy</dt>
              <dd>Docker on NAS</dd>
            </div>
          </dl>
        </aside>
      </section>
    </>
  );
}
