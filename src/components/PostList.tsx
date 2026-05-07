import type { Collection, PostMeta } from "@/lib/content";
import { PostCard } from "./PostCard";

type PostListProps = {
  posts: PostMeta[];
  collection: Collection;
};

export function PostList({ posts, collection }: PostListProps) {
  if (posts.length === 0) {
    return <p className="empty-state">아직 공개된 글이 없습니다.</p>;
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} collection={collection} />
      ))}
    </div>
  );
}
