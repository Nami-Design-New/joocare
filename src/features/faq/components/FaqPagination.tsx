import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { buildFaqPagePath, getVisiblePages } from "../utils";

type FaqPaginationProps = {
  locale: string;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
};

export default function FaqPagination({
  locale,
  currentPage,
  totalPages,
  pageSize,
  totalItems,
}: FaqPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2 px-3 pb-20 md:gap-8 lg:px-20">
      <div className="text-muted-foreground order-2 text-sm font-medium md:order-1">
        Show <span className="font-semibold">{start} - {end}</span> from{" "}
        <span className="font-semibold">{totalItems}</span>
      </div>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent className="gap-1">
          <PaginationItem>
            <PaginationPrevious
              href={currentPage > 1 ? buildFaqPagePath(locale, currentPage - 1) : "#"}
              aria-disabled={currentPage <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 p-0 hover:bg-gray-200 aria-disabled:pointer-events-none aria-disabled:opacity-50"
            />
          </PaginationItem>

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
                    href={buildFaqPagePath(locale, page)}
                    isActive={page === currentPage}
                    className={`h-8 w-8 rounded-full border-none ${
                      page === currentPage ? "bg-primary text-white" : "text-muted-foreground"
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              </div>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href={currentPage < totalPages ? buildFaqPagePath(locale, currentPage + 1) : "#"}
              aria-disabled={currentPage >= totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 p-0 text-gray-600 hover:bg-gray-200 aria-disabled:pointer-events-none aria-disabled:opacity-50"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
