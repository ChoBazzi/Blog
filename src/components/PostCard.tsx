import type { Collection, PostMeta } from "@/lib/content";
import { collectionLabels, collectionPaths } from "@/lib/content";

type PostCardProps = {
  post: PostMeta;
  collection: Collection;
};

export function PostCard({ post, collection }: PostCardProps) {
  return (
    <article className="post-card">
      <a className="post-card-link" href={`${collectionPaths[collection]}/${post.slug}`}>
        {post.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="post-card-cover" src={post.cover} alt="" loading="lazy" />
        ) : (
          <div className="post-card-cover post-card-cover-fallback" aria-hidden="true">
            {post.title.slice(0, 1)}
          </div>
        )}
        <div className="post-card-body">
          <div className="post-card-meta">
            <span>{collectionLabels[collection]}</span>
            <time dateTime={post.date}>{post.date}</time>
            {post.category ? <span>{post.category}</span> : null}
          </div>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
          <ul className="tag-list" aria-label={`${post.title} tags`}>
            {post.tags.slice(0, 4).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      </a>
    </article>
  );
}
