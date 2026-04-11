"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchCompanyJobsPageClient } from "../services/company-profile-service";
import { getInfiniteCompanyJobsQueryOptions } from "../utils/company-jobs-utils";

type UseInfiniteCompanyJobsOptions = {
  slug: string;
  locale: string;
};

export function useInfiniteCompanyJobs({
  slug,
  locale,
}: UseInfiniteCompanyJobsOptions) {
  const query = useInfiniteQuery(
    getInfiniteCompanyJobsQueryOptions({
      slug,
      locale,
      fetchPage: fetchCompanyJobsPageClient,
    }),
  );


  return {
    ...query,
    jobs: query.data?.pages.flatMap((page) => page.data) ?? [],
  };
}
