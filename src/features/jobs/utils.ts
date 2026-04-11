import { formatDistanceToNowStrict } from "date-fns";

import { getBaseApiUrl } from "@/shared/lib/api-endpoints";
import { JobListItem } from "./types/jobs.types";
import { JobsSearchFilters } from "./types/index.types";

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
    specialties: getArrayParam(searchParams, "specialties[]", "specialties"),
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
    ["specialties[]", filters.specialties],
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

export function getJobLocation(job: JobListItem) {
  return [job.city?.name, job.country?.name].filter(Boolean).join(", ") || "Location not specified";
}

export function getJobSalary(job: JobListItem) {
  if (job.min_salary && job.max_salary) {
    return `${job.min_salary} - ${job.max_salary}${job.currency?.code ? ` ${job.currency.code}` : ""}`;
  }

  if (job.min_salary || job.max_salary) {
    return `${job.min_salary || job.max_salary}${job.currency?.code ? ` ${job.currency.code}` : ""}`;
  }

  return "Salary not specified";
}
