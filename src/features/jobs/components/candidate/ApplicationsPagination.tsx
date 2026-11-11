'use client';

import { CustomPagination } from '@/shared/components/CustomPagination';

type ApplicationsPaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  getHref: (page: number) => string;
};

// Pagination of the Job Applications tabs, shown whenever there are items (as in the design).
export default function ApplicationsPagination({
  totalItems,
  ...props
}: ApplicationsPaginationProps) {
  if (!totalItems) return null;
  return (
    <CustomPagination
      {...props}
      totalItems={totalItems}
      onPageChange={() => undefined}
      statusPosition="start"
      tone="strong"
      align="start"
      showLastPage={false}
      visiblePageCount={5}
      className="mt-4 justify-between [&_[aria-current=page]]:bg-application-primary"
    />
  );
}
