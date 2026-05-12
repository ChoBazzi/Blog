type PaginationProps = {
  basePath: string;
  currentPage: number;
  query?: Record<string, string | undefined>;
  totalPages: number;
};

export function Pagination({ basePath, currentPage, query = {}, totalPages }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageHref = (page: number) => {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    if (page > 1) {
      params.set("page", String(page));
    }

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      {currentPage > 1 ? (
        <a href={pageHref(currentPage - 1)} aria-label="Previous page">
          Previous
        </a>
      ) : (
        <span aria-disabled="true">Previous</span>
      )}

      <div className="pagination-pages">
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          return page === currentPage ? (
            <span className="active" key={page} aria-current="page">
              {page}
            </span>
          ) : (
            <a href={pageHref(page)} key={page}>
              {page}
            </a>
          );
        })}
      </div>

      {currentPage < totalPages ? (
        <a href={pageHref(currentPage + 1)} aria-label="Next page">
          Next
        </a>
      ) : (
        <span aria-disabled="true">Next</span>
      )}
    </nav>
  );
}
