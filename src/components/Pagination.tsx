type PaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
};

export function Pagination({ basePath, currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageHref = (page: number) => (page === 1 ? basePath : `${basePath}?page=${page}`);

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
