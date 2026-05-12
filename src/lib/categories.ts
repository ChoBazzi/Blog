import type { PostMeta } from "@/lib/content";

export function getCategoryParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function getCategories(posts: PostMeta[]) {
  return Array.from(new Set(posts.map((post) => post.category).filter(Boolean) as string[])).sort(
    (a, b) => a.localeCompare(b),
  );
}

export function filterByCategory(posts: PostMeta[], category: string | undefined) {
  return category ? posts.filter((post) => post.category === category) : posts;
}

export function formatCategoryLabel(category: string) {
  return category
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(" ");
}
