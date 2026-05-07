import { PostList } from "@/components/PostList";
import { getCollection } from "@/lib/content";

export const metadata = {
  title: "Notes",
};

export default async function NotesPage() {
  const posts = await getCollection("notes");

  return (
    <section className="page-shell">
      <p className="eyebrow">Notes</p>
      <h1>공부 자료와 개념 정리</h1>
      <PostList posts={posts} collection="notes" />
    </section>
  );
}
