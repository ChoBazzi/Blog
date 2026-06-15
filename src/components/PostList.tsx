import type { Collection, PostMeta } from "@/lib/content";
import { PostCard } from "./PostCard";

type PostListProps = {
  posts: PostMeta[];
  collection: Collection;
  className?: string;
};

export function PostList({ posts, collection, className = "" }: PostListProps) {
  if (posts.length === 0) {
    return <p className="empty-state">아직 공개된 글이 없습니다.</p>;
  }

  return (
    <div className={["post-list", className].filter(Boolean).join(" ")}>
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} collection={collection} />
      ))}
    </div>
  );
}
