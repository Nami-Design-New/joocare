import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { getBaseApiUrl, getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import { JobsFiltersData, JobsFilterOption, JobsSearchFilters } from "../types/index.types";
import { JobsListingResponse } from "../types/jobs.types";
import { buildJobsQueryString } from "../utils";

type LocalizedValue =
  | string
  | {
    ar?: string | null;
    en?: string | null;
  }
  | null
  | undefined;

type RawLookupItem = {
  id?: number | string | null;
  title?: LocalizedValue;
  name?: LocalizedValue;
  word?: string | null;
};

const PAGE_SIZE = 10;

function resolveLocalizedValue(value: LocalizedValue, locale: string) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return locale === "ar" ? value.ar ?? value.en ?? "" : value.en ?? value.ar ?? "";
}

function normalizeLookupItem(item: RawLookupItem, locale: string): JobsFilterOption | null {
  const value = item.id ? String(item.id) : "";
  const label =
    resolveLocalizedValue(item.title, locale) ||
    resolveLocalizedValue(item.name, locale) ||
    item.word ||
    "";

  if (!value || !label) {
    return null;
  }

  return { value, label };
}

async function fetchLookupOptions(
  endpoint: string,
  locale: string,
  extraParams?: Record<string, string>,
) {
  const params = new URLSearchParams({
    pagination: "on",
    limit_per_page: "100",
    page: "1",
  });

  Object.entries(extraParams ?? {}).forEach(([key, value]) => {
    if (value.trim()) {
      params.set(key, value);
    }
  });

  const response = await fetch(`${getBaseApiUrl()}/${endpoint}?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}.`);
  }

  const payload = (await response.json()) as { data?: RawLookupItem[] };

  return (payload.data ?? [])
    .map((item) => normalizeLookupItem(item, locale))
    .filter((item): item is JobsFilterOption => Boolean(item));
}

export async function getJobsListing(
  locale: string,
  filters: JobsSearchFilters
): Promise<JobsListingResponse> {
  const params = new URLSearchParams({
    pagination: "on",
    limit_per_page: String(PAGE_SIZE),
    page: String(filters.page),
  });
  const queryString = buildJobsQueryString({ ...filters, page: filters.page });

  if (queryString) {
    const searchParams = new URLSearchParams(queryString);
    searchParams.forEach((value, key) => {
      if (key !== "page") {
        params.append(key, value);
      }
    });
  }

  const session = await getServerSession(authOptions);
  const result = await apiFetch(
    `${getUserApiUrl()}/jobs?${params.toString()}`,
    {
      method: "GET",
      locale,
      cache: "no-store",
      token: session?.accessToken,
    }
  );

  if (!result.ok || !result.data) {
    throw new Error(
      result.message || `Failed to load jobs from ${getUserApiUrl()}/jobs.`
    );
  }

  const response = result.data as unknown as JobsListingResponse;

  if (!response?.data) {
    throw new Error("Jobs listing payload is missing");
  }

  return response;
}

export async function getJobsFiltersData(locale: string) {
  const [
    countries,
    categories,
    domains,
    specialties,
    experiences,
    availabilities,
    employmentTypes,
    roleCategories,
    salaryTypes,
    seniorityLevels,
    jobTitles,
  ] = await Promise.all([
    fetchLookupOptions("countries", locale),
    fetchLookupOptions("categories", locale),
    fetchLookupOptions("domains", locale),
    fetchLookupOptions("specialties", locale),
    fetchLookupOptions("experiences", locale),
    fetchLookupOptions("availabilities", locale),
    fetchLookupOptions("employment-types", locale),
    fetchLookupOptions("role-categories", locale),
    fetchLookupOptions("salary-types", locale),
    fetchLookupOptions("seniority-levels", locale),
    fetchLookupOptions("job-titles", locale),
  ]);

  return {
    countries,
    categories,
    domains,
    specialties,
    experiences,
    availabilities,
    employmentTypes,
    roleCategories,
    salaryTypes,
    seniorityLevels,
    jobTitles,
  } satisfies JobsFiltersData;
}
