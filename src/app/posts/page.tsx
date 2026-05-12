import { CategoryFilter } from "@/components/CategoryFilter";
import { CollectionHero } from "@/components/CollectionHero";
import { PostList } from "@/components/PostList";
import { Pagination } from "@/components/Pagination";
import { filterByCategory, getCategories, getCategoryParam } from "@/lib/categories";
import { getCollection } from "@/lib/content";
import { getPageNumber, paginate } from "@/lib/pagination";

export const metadata = {
  title: "전체 게시글",
};

type PageProps = {
  searchParams: Promise<{ category?: string | string[]; page?: string | string[] }>;
};

export default async function PostsPage({ searchParams }: PageProps) {
  const posts = await getCollection("blog");
  const { category, page } = await searchParams;
  const categories = getCategories(posts);
  const categoryParam = getCategoryParam(category);
  const selectedCategory = categories.includes(categoryParam ?? "") ? categoryParam : undefined;
  const filteredPosts = filterByCategory(posts, selectedCategory);
  const paginated = paginate(filteredPosts, getPageNumber(page));

  return (
    <section className="page-shell collection-page">
      <CollectionHero eyebrow="All Posts" iconSrc="/icons/project.png" title="전체 게시글" />
      <CategoryFilter basePath="/posts" categories={categories} selectedCategory={selectedCategory} />
      <PostList posts={paginated.items} collection="blog" />
      <Pagination
        basePath="/posts"
        currentPage={paginated.currentPage}
        query={{ category: selectedCategory }}
        totalPages={paginated.totalPages}
      />
    </section>
  );
}
