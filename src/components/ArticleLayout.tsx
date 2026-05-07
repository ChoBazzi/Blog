import type { Collection, Post } from "@/lib/content";
import { collectionLabels } from "@/lib/content";

type ArticleLayoutProps = {
  collection: Collection;
  post: Post;
};

export function ArticleLayout({ collection, post }: ArticleLayoutProps) {
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
        <p className="eyebrow">{collectionLabels[collection]}</p>
        <h1>{post.title}</h1>
        <p className="article-description">{post.description}</p>
        <div className="article-meta">
          <time dateTime={post.date}>{post.date}</time>
          <span>{post.tags.join(", ")}</span>
        </div>
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
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
