import { formatCategoryLabel } from "@/lib/categories";

type CategoryFilterProps = {
  basePath: string;
  categories: string[];
  query?: Record<string, string | undefined>;
  selectedCategory?: string;
};

export function CategoryFilter({
  basePath,
  categories,
  query = {},
  selectedCategory,
}: CategoryFilterProps) {
  if (categories.length === 0) {
    return null;
  }

  const categoryHref = (category?: string) => {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  return (
    <nav className="category-filter" aria-label="Sub categories">
      <a className={!selectedCategory ? "active" : undefined} href={categoryHref()}>
        All
      </a>
      {categories.map((category) => (
        <a
          className={selectedCategory === category ? "active" : undefined}
          href={categoryHref(category)}
          key={category}
        >
          {formatCategoryLabel(category)}
        </a>
      ))}
    </nav>
  );
}
