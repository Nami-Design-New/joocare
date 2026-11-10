'use client';

import { CustomPagination } from '@/shared/components/CustomPagination';
import { PROFILE_INSIGHTS_ROUTES } from '../constants';
import { buildProfileInsightsQuery } from '../utils/profile-viewers';

type ProfileViewersPaginationProps = {
  search: string;
  currentPage: number;
  totalItems: number;
  pageSize: number;
};

// "Show 1 - 10 from 57" + page links that keep the current search.
export default function ProfileViewersPagination({
  search,
  ...props
}: ProfileViewersPaginationProps) {
  return (
    <CustomPagination
      {...props}
      onPageChange={() => undefined}
      getHref={(page) =>
        `${PROFILE_INSIGHTS_ROUTES.root}${buildProfileInsightsQuery({ search, page })}`
      }
      statusPosition="start"
      tone="strong"
      align="start"
      showLastPage={false}
      visiblePageCount={5}
      className="[&_[aria-current=page]]:bg-assessment-primary"
    />
  );
}
