const PAGE_SIZE = 10;

export function getPageNumber(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function paginate<T>(items: T[], currentPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;

  return {
    currentPage: safePage,
    items: items.slice(start, start + PAGE_SIZE),
    totalPages,
  };
}
