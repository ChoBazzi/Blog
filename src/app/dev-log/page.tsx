import { CategoryFilter } from "@/components/CategoryFilter";
import { CollectionHero } from "@/components/CollectionHero";
import { PostList } from "@/components/PostList";
import { Pagination } from "@/components/Pagination";
import { filterByCategory, getCategories, getCategoryParam } from "@/lib/categories";
import { getCollection } from "@/lib/content";
import { getPageNumber, paginate } from "@/lib/pagination";

export const metadata = {
  title: "Dev Log",
};

type PageProps = {
  searchParams: Promise<{ category?: string | string[]; page?: string | string[] }>;
};

export default async function DevLogPage({ searchParams }: PageProps) {
  const posts = (await getCollection("blog")).filter((post) => post.category !== "project");
  const { category, page } = await searchParams;
  const categories = getCategories(posts);
  const categoryParam = getCategoryParam(category);
  const selectedCategory = categories.includes(categoryParam ?? "") ? categoryParam : undefined;
  const filteredPosts = filterByCategory(posts, selectedCategory);
  const paginated = paginate(filteredPosts, getPageNumber(page));

  return (
    <section className="page-shell collection-page">
      <CollectionHero eyebrow="Dev Log" iconSrc="/icons/devlog.png" title="개발 과정과 회고 기록" />
      <CategoryFilter basePath="/dev-log" categories={categories} selectedCategory={selectedCategory} />
      <PostList posts={paginated.items} collection="blog" />
      <Pagination
        basePath="/dev-log"
        currentPage={paginated.currentPage}
        query={{ category: selectedCategory }}
        totalPages={paginated.totalPages}
      />
    </section>
  );
}
