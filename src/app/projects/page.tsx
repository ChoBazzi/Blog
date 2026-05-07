import { PostList } from "@/components/PostList";
import { getCollection } from "@/lib/content";

export const metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const posts = await getCollection("projects");

  return (
    <section className="page-shell">
      <p className="eyebrow">Projects</p>
      <h1>프로젝트와 구현 기록</h1>
      <PostList posts={posts} collection="projects" />
    </section>
  );
}
