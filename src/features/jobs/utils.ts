import { formatDistanceToNowStrict } from "date-fns";

import { getBaseApiUrl } from "@/shared/lib/api-endpoints";
import { JobDetails, JobListItem } from "./types/jobs.types";
import { JobsSearchFilters, JobStatus } from "./types/index.types";

function getSingleParam(
  searchParams: Record<string, string | string[] | undefined>,
  ...keys: string[]
) {
  for (const key of keys) {
    const value = searchParams[key];

    if (typeof value === "string") {
      return value;
    }

    if (Array.isArray(value) && value.length > 0) {
      return value[0] ?? "";
    }
  }

  return "";
}

function getArrayParam(
  searchParams: Record<string, string | string[] | undefined>,
  ...keys: string[]
) {
  const values = keys.flatMap((key) => {
    const value = searchParams[key];

    if (typeof value === "string") {
      return [value];
    }

    return Array.isArray(value) ? value : [];
  });

  return values.filter((value) => value.trim().length > 0);
}

export function normalizeJobsSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): JobsSearchFilters {
  const pageValue = Number.parseInt(getSingleParam(searchParams, "page"), 10);

  return {
    page: Number.isNaN(pageValue) || pageValue < 1 ? 1 : pageValue,
    search: getSingleParam(searchParams, "search").trim(),
    country: getSingleParam(searchParams, "country"),
    professionalLicense: getSingleParam(searchParams, "professional_license"),
    domain: getSingleParam(searchParams, "domain"),
    minSalary: getSingleParam(searchParams, "min_salary"),
    maxSalary: getSingleParam(searchParams, "max_salary"),
    roleCategories: getArrayParam(
      searchParams,
      "role_categories[]",
      "role_categories",
    ),
    seniorityLevels: getArrayParam(
      searchParams,
      "seniority_levels[]",
      "seniority_levels",
    ),
    // specialties: getArrayParam(searchParams, "specialties[]", "specialties"),
    experiences: getArrayParam(searchParams, "experiences[]", "experiences"),
    availabilities: getArrayParam(searchParams, "availabilities[]", "availabilities"),
    salaryTypes: getArrayParam(searchParams, "salary_types[]", "salary_types"),
    categories: getArrayParam(searchParams, "categories[]", "categories"),
    employmentTypes: getArrayParam(
      searchParams,
      "employment_types[]",
      "employment_types",
    ),
  };
}

export function buildJobsQueryString(filters: JobsSearchFilters) {
  const params = new URLSearchParams();
  const arrayFilters: Array<[string, string[]]> = [
    ["role_categories[]", filters.roleCategories],
    ["seniority_levels[]", filters.seniorityLevels],
    // ["specialties[]", filters.specialties],
    ["experiences[]", filters.experiences],
    ["availabilities[]", filters.availabilities],
    ["salary_types[]", filters.salaryTypes],
    ["categories[]", filters.categories],
    ["employment_types[]", filters.employmentTypes],
  ];

  if (filters.page > 1) {
    params.set("page", String(filters.page));
  }

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.country) {
    params.set("country", filters.country);
  }

  if (filters.professionalLicense) {
    params.set("professional_license", filters.professionalLicense);
  }

  if (filters.domain) {
    params.set("domain", filters.domain);
  }

  if (filters.minSalary) {
    params.set("min_salary", filters.minSalary);
  }

  if (filters.maxSalary) {
    params.set("max_salary", filters.maxSalary);
  }

  arrayFilters.forEach(([key, values]) => {
    values.forEach((value) => {
      if (value.trim()) {
        params.append(key, value);
      }
    });
  });

  return params.toString();
}

export function buildJobsPagePath(locale: string, filters: JobsSearchFilters) {
  const queryString = buildJobsQueryString(filters);

  return `/${locale}/jobs${queryString ? `?${queryString}` : ""}`;
}

export function buildSavedJobsPagePath(locale: string, page: number) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();

  return `/${locale}/jobs/saved${queryString ? `?${queryString}` : ""}`;
}

export function buildCandidateApplicationsPagePath(locale: string, page: number) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();

  return `/${locale}/candidate/applications${queryString ? `?${queryString}` : ""}`;
}

export function getSiteOrigin() {
  const baseUrl = getBaseApiUrl();

  return baseUrl.replace(/\/api\/?$/, "");
}

export function getJobPostedAtLabel(date: string | null) {
  if (!date) {
    return "Recently posted";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently posted";
  }

  return formatDistanceToNowStrict(parsedDate, { addSuffix: true });
}

export function getJobLocation(job: Pick<JobListItem | JobDetails, "city" | "country">) {
  return [job.city?.name, job.country?.name].filter(Boolean).join(", ") || "Location not specified";
}

function parseSalaryAmount(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.replace(/,/g, "").trim();
  if (!normalizedValue) {
    return null;
  }

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

function formatSalaryAmount(value: string | number | null | undefined) {
  const parsedValue = parseSalaryAmount(value);
  return parsedValue == null ? null : parsedValue.toLocaleString("en-US");
}

type SalaryLike = {
  min_salary: string | number | null | undefined;
  max_salary: string | number | null | undefined;
  currency?: JobListItem["currency"] | JobDetails["currency"] | null;
  hasSalary?: boolean
};

export function getJobSalary(job: SalaryLike) {
  const minSalary = formatSalaryAmount(job.min_salary);
  const maxSalary = formatSalaryAmount(job.max_salary);
  const hasMinSalary = minSalary !== null;
  const hasMaxSalary = maxSalary !== null;

  if (hasMinSalary && hasMaxSalary) {
    return `${minSalary} - ${maxSalary}`;
  }

  if (hasMinSalary || hasMaxSalary) {
    return minSalary ?? maxSalary ?? "Not specified";
  }
  if (!job.hasSalary) return "Not specified";
  return "Not specified";
}
export function getJobSalaryWithCurrency(job: SalaryLike) {
  const minSalary = formatSalaryAmount(job.min_salary);
  const maxSalary = formatSalaryAmount(job.max_salary);
  const hasMinSalary = minSalary !== null;
  const hasMaxSalary = maxSalary !== null;

  if (hasMinSalary && hasMaxSalary) {
    return `${minSalary}${job.currency?.code ? job.currency?.code : ''} - ${maxSalary}${job.currency?.code ? job.currency?.code : ''}`;
  }

  if (hasMinSalary || hasMaxSalary) {
    return minSalary ?? maxSalary ?? "Not specified";
  }

  return "Not specified";
}

export function normalizeJobStatus(status: string | null | undefined): JobStatus {
  switch (status?.toLowerCase()) {
    case "closed":
      return "closed";
    case "paused":
    case "pause":
      return "paused";
    case "draft":
      return "draft";
    default:
      return "open";
  }
}

export function truncateText(text: string, maxLength = 150) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
export function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}
