import { PostList } from "@/components/PostList";
import { Pagination } from "@/components/Pagination";
import { getCollection } from "@/lib/content";
import { getPageNumber, paginate } from "@/lib/pagination";

export const metadata = {
  title: "Notes",
};

type PageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

export default async function NotesPage({ searchParams }: PageProps) {
  const posts = await getCollection("notes");
  const { page } = await searchParams;
  const paginated = paginate(posts, getPageNumber(page));

  return (
    <section className="page-shell collection-page">
      <p className="eyebrow">Notes</p>
      <h1>공부 자료와 개념 정리</h1>
      <PostList posts={paginated.items} collection="notes" />
      <Pagination basePath="/notes" currentPage={paginated.currentPage} totalPages={paginated.totalPages} />
    </section>
  );
}
