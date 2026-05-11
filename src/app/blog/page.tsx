import { PostList } from "@/components/PostList";
import { Pagination } from "@/components/Pagination";
import { getCollection } from "@/lib/content";
import { getPageNumber, paginate } from "@/lib/pagination";

export const metadata = {
  title: "Blog",
};

type PageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

export default async function BlogPage({ searchParams }: PageProps) {
  const posts = await getCollection("blog");
  const { page } = await searchParams;
  const paginated = paginate(posts, getPageNumber(page));

  return (
    <section className="page-shell collection-page">
      <p className="eyebrow">Blog</p>
      <h1>회고와 문제 해결 기록</h1>
      <PostList posts={paginated.items} collection="blog" />
      <Pagination basePath="/blog" currentPage={paginated.currentPage} totalPages={paginated.totalPages} />
    </section>
  );
}
