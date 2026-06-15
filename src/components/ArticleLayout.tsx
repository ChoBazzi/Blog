import type { ReactNode } from "react";
import type { Collection, Post } from "@/lib/content";
import { collectionLabels } from "@/lib/content";
import { ArchitectureMap } from "@/components/ArchitectureMap";
import { MermaidRenderer } from "@/components/MermaidRenderer";

type ArticleLayoutProps = {
  collection: Collection;
  post: Post;
};

export function ArticleLayout({ collection, post }: ArticleLayoutProps) {
  const articleContent = renderArticleContent(post.html);

  return (
    <div className="docs-layout article-layout">
      <aside className="docs-sidebar" aria-label="Content properties">
        <p className="sidebar-label">Properties</p>
        <dl className="property-list">
          <div>
            <dt>Type</dt>
            <dd>{collectionLabels[collection]}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>
              <time dateTime={post.date}>{post.date}</time>
            </dd>
          </div>
          {post.category ? (
            <div>
              <dt>Category</dt>
              <dd>{post.category}</dd>
            </div>
          ) : null}
          <div>
            <dt>Tags</dt>
            <dd>{post.tags.join(", ")}</dd>
          </div>
        </dl>
      </aside>

      <article className="article-shell">
        {post.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="article-cover" src={post.cover} alt="" />
        ) : null}
        <div className="page-icon" aria-hidden="true">
          {collection === "projects" ? "🛠️" : collection === "notes" ? "📝" : "📄"}
        </div>
        <p className="eyebrow">{collectionLabels[collection]}</p>
        <h1>{post.title}</h1>
        <p className="article-description">{post.description}</p>
        <div className="article-meta">
          <time dateTime={post.date}>{post.date}</time>
          <span>{post.tags.join(", ")}</span>
        </div>
        <div className="prose">{articleContent}</div>
        <MermaidRenderer />
      </article>

      <aside className="toc" aria-label="On this page">
        <p className="sidebar-label">On this page</p>
        {post.headings.length > 0 ? (
          <nav>
            {post.headings.map((heading) => (
              <a
                className={heading.level === 3 ? "toc-child" : undefined}
                href={`#${heading.id}`}
                key={`${heading.id}-${heading.text}`}
              >
                {heading.text}
              </a>
            ))}
          </nav>
        ) : (
          <p className="toc-empty">No sections</p>
        )}
      </aside>
    </div>
  );
}

function renderArticleContent(html: string) {
  const nodes: ReactNode[] = [];
  const architectureMapPattern = /<div data-architecture-map="([^"]+)"><\/div>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = architectureMapPattern.exec(html)) !== null) {
    const htmlBefore = html.slice(lastIndex, match.index);
    if (htmlBefore) {
      nodes.push(<ArticleHtml html={htmlBefore} key={`html-${lastIndex}`} />);
    }

    nodes.push(<ArchitectureMap id={match[1]} key={`architecture-${match.index}-${match[1]}`} />);
    lastIndex = match.index + match[0].length;
  }

  const htmlAfter = html.slice(lastIndex);
  if (htmlAfter) {
    nodes.push(<ArticleHtml html={htmlAfter} key={`html-${lastIndex}`} />);
  }

  return nodes.length > 0 ? nodes : <ArticleHtml html={html} />;
}

function ArticleHtml({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
