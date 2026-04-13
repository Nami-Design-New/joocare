"use client";
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
  getHref?: (page: number) => string;
};

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);

  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  return [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
}

export function CustomPagination({
  currentPage,
  totalItems,
  pageSize = 10,
  onPageChange,
  getHref,
}: CustomPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const pages = getVisiblePages(currentPage, totalPages);
  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  const handleChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2 md:gap-8">
      {/* Status */}
      <div className="text-muted-foreground order-2 text-sm font-medium md:order-1">
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
              href={
                !isPreviousDisabled && getHref
                  ? getHref(Math.max(1, currentPage - 1))
                  : undefined
              }
              aria-disabled={isPreviousDisabled}
              tabIndex={isPreviousDisabled ? -1 : undefined}
              onClick={(event) => {
                if (isPreviousDisabled) {
                  event.preventDefault();
                  return;
                }
                handleChange(currentPage - 1);
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-full p-0 ${
                isPreviousDisabled
                  ? "cursor-not-allowed bg-gray-100 text-gray-400 opacity-50"
                  : "cursor-pointer bg-gray-100 hover:bg-gray-200"
              }`}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {pages.map((page, index) => {
            const previousPage = pages[index - 1];

            return (
              <div key={page} className="flex items-center gap-1">
                {previousPage && page - previousPage > 1 ? (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : null}
                <PaginationItem>
                  <PaginationLink
                    href={getHref ? getHref(page) : undefined}
                    isActive={page === currentPage}
                    onClick={() => handleChange(page)}
                    className={`h-8 w-8 rounded-full border-none ${page === currentPage ? "bg-primary text-white" : "text-muted-foreground"
                      }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              </div>
            );
          })}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              href={
                !isNextDisabled && getHref
                  ? getHref(Math.min(totalPages, currentPage + 1))
                  : undefined
              }
              aria-disabled={isNextDisabled}
              tabIndex={isNextDisabled ? -1 : undefined}
              onClick={(event) => {
                if (isNextDisabled) {
                  event.preventDefault();
                  return;
                }
                handleChange(currentPage + 1);
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-full p-0 ${
                isNextDisabled
                  ? "cursor-not-allowed bg-gray-100 text-gray-400 opacity-50"
                  : "cursor-pointer bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
