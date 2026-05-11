import { PostList } from "@/components/PostList";
import { Pagination } from "@/components/Pagination";
import { getCollection } from "@/lib/content";
import { getPageNumber, paginate } from "@/lib/pagination";

export const metadata = {
  title: "Projects",
};

type PageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

export default async function ProjectsPage({ searchParams }: PageProps) {
  const posts = await getCollection("projects");
  const { page } = await searchParams;
  const paginated = paginate(posts, getPageNumber(page));

  return (
    <section className="page-shell collection-page">
      <p className="eyebrow">Projects</p>
      <h1>프로젝트와 구현 기록</h1>
      <PostList posts={paginated.items} collection="projects" />
      <Pagination basePath="/projects" currentPage={paginated.currentPage} totalPages={paginated.totalPages} />
    </section>
  );
}
