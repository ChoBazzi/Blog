import { PostList } from "@/components/PostList";
import { getCollection } from "@/lib/content";

export const metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const posts = await getCollection("blog");

  return (
    <section className="page-shell">
      <p className="eyebrow">Blog</p>
      <h1>회고와 문제 해결 기록</h1>
      <PostList posts={posts} collection="blog" />
    </section>
  );
}
