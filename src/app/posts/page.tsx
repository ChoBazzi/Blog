import { CategoryFilter } from "@/components/CategoryFilter";
import { CollectionHero } from "@/components/CollectionHero";
import { Pagination } from "@/components/Pagination";
import { PostCard } from "@/components/PostCard";
import { getCategories, getCategoryParam } from "@/lib/categories";
import type { Collection, PostMeta } from "@/lib/content";
import { getCollection } from "@/lib/content";
import { getPageNumber, paginate } from "@/lib/pagination";

export const metadata = {
  title: "전체게시글",
};

type PageProps = {
  searchParams: Promise<{ category?: string | string[]; page?: string | string[] }>;
};

export default async function PostsPage({ searchParams }: PageProps) {
  const [blog, projects, notes] = await Promise.all([
    getCollection("blog"),
    getCollection("projects"),
    getCollection("notes"),
  ]);
  const { category, page } = await searchParams;
  const entries = getAllEntries(blog, projects, notes);
  const categories = getCategories(entries.map((entry) => entry.post));
  const categoryParam = getCategoryParam(category);
  const selectedCategory = categories.includes(categoryParam ?? "") ? categoryParam : undefined;
  const filteredEntries = selectedCategory
    ? entries.filter((entry) => entry.post.category === selectedCategory)
    : entries;
  const paginated = paginate(filteredEntries, getPageNumber(page));

  return (
    <section className="page-shell collection-page">
      <CollectionHero eyebrow="All Posts" iconSrc="/icons/project.png" title="전체게시글" />
      <CategoryFilter basePath="/posts" categories={categories} selectedCategory={selectedCategory} />
      <AllPostList entries={paginated.items} />
      <Pagination
        basePath="/posts"
        currentPage={paginated.currentPage}
        query={{ category: selectedCategory }}
        totalPages={paginated.totalPages}
      />
    </section>
  );
}

type AllPostEntry = {
  collection: Collection;
  post: PostMeta;
};

function getAllEntries(blog: PostMeta[], projects: PostMeta[], notes: PostMeta[]): AllPostEntry[] {
  return [
    ...blog.map((post) => ({ collection: "blog" as const, post })),
    ...projects.map((post) => ({ collection: "projects" as const, post })),
    ...notes.map((post) => ({ collection: "notes" as const, post })),
  ].sort((a, b) => b.post.date.localeCompare(a.post.date));
}

function AllPostList({ entries }: { entries: AllPostEntry[] }) {
  if (entries.length === 0) {
    return <p className="empty-state">아직 공개된 글이 없습니다.</p>;
  }

  return (
    <div className="post-list">
      {entries.map((entry) => (
        <PostCard collection={entry.collection} key={`${entry.collection}-${entry.post.slug}`} post={entry.post} />
      ))}
    </div>
  );
}
