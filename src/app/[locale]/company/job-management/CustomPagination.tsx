import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";

export function CustomPagination() {
  return (
    <div className="flex w-full max-w-2xl items-center justify-between font-sans">
      {/* Left Side: Status Text */}
      <div className="text-sm font-medium text-gray-700">
        Show <span className="font-semibold">1 - 10</span> from
        <span className="font-semibold">57</span>
      </div>

      {/* Right Side: Pagination Controls */}
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent className="gap-1">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className="text--muted-foreground flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 p-0 transition-colors hover:bg-gray-200"
            />
          </PaginationItem>

          <PaginationItem>
            {/* Active State: Green Circle */}
            <PaginationLink
              href="#"
              isActive
              className="bg-primary h-8 w-8 rounded-full border-none text-white hover:bg-green-800"
            >
              1
            </PaginationLink>
          </PaginationItem>

          {[2, 3, 4, 5].map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                className="text-muted-foreground h-8 w-8 rounded-full border-none hover:bg-gray-100"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationEllipsis className="text-gray-400" />
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              href="#"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 p-0 text-gray-600 transition-colors hover:bg-gray-200"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
