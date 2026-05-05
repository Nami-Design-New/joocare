import { infiniteQueryOptions } from "@tanstack/react-query";

import { CompanyJobsResponse } from "../company-profile.type";

export const COMPANY_SHARED_PROFILE_JOBS_PAGE_SIZE = 10;

export type FetchCompanyJobsPageOptions = {
  slug: string;
  locale: string;
  page?: number;
};

export function buildCompanyJobsSearchParams(page: number) {
  return new URLSearchParams({
    pagination: "on",
    limit_per_page: String(COMPANY_SHARED_PROFILE_JOBS_PAGE_SIZE),
    page: String(page),
  });
}

export function getCompanyJobsQueryKey(slug: string, locale: string) {
  return ["shared-company-profile-jobs", slug, locale] as const;
}

export function getCompanyJobsNextPageParam(lastPage: CompanyJobsResponse) {
  if (!lastPage.next_page_url) {
    return undefined;
  }

  const url = new URL(lastPage.next_page_url);
  const page = Number(url.searchParams.get("page"));

  return Number.isNaN(page) ? undefined : page;
}

export function getInfiniteCompanyJobsQueryOptions({
  slug,
  locale,
  fetchPage,
}: {
  slug: string;
  locale: string;
  fetchPage: (options: FetchCompanyJobsPageOptions) => Promise<CompanyJobsResponse>;
}) {
  return infiniteQueryOptions({
    queryKey: getCompanyJobsQueryKey(slug, locale),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchPage({
        slug,
        locale,
        page: Number(pageParam),
      }),
    getNextPageParam: getCompanyJobsNextPageParam,
  });
}
