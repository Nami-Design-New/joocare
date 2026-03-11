import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";

type CustomPaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
};

export function CustomPagination({
  currentPage,
  totalItems,
  pageSize = 10,
  onPageChange,
}: CustomPaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="flex w-full max-w-2xl items-center gap-8">
      {/* Status */}
      <div className="text-sm font-medium text-gray-700">
        Show{" "}
        <span className="font-semibold">
          {start} - {end}
        </span>{" "}
        from <span className="font-semibold">{totalItems}</span>
      </div>

      {/* Pagination */}
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent className="gap-1">
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handleChange(currentPage - 1)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 p-0 hover:bg-gray-200"
            />
          </PaginationItem>

          {/* Page Numbers */}
          {pages.slice(0, 5).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => handleChange(page)}
                className={`h-8 w-8 rounded-full border-none ${
                  page === currentPage
                    ? "bg-primary text-white"
                    : "text-muted-foreground"
                }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {totalPages > 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              onClick={() => handleChange(currentPage + 1)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 p-0 text-gray-600 hover:bg-gray-200"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
