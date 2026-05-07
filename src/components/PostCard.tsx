import Link from "next/link";
import type { Collection, PostMeta } from "@/lib/content";
import { collectionPaths } from "@/lib/content";

type PostCardProps = {
  post: PostMeta;
  collection: Collection;
};

export function PostCard({ post, collection }: PostCardProps) {
  return (
    <article className="post-card">
      <div className="post-card-meta">
        <span>{collection}</span>
        <time dateTime={post.date}>{post.date}</time>
        {post.category ? <span>{post.category}</span> : null}
      </div>
      <h2>
        <Link href={`${collectionPaths[collection]}/${post.slug}`}>{post.title}</Link>
      </h2>
      <p>{post.description}</p>
      <ul className="tag-list" aria-label={`${post.title} tags`}>
        {post.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </article>
  );
}
