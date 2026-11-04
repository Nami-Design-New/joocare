import { formatDistanceToNowStrict } from 'date-fns';

import { getBaseApiUrl } from '@/shared/lib/api-endpoints';
import { assessmentSeeds } from '@/features/company-assessments/constants/assessment-data';
import { JobDetails, JobLinkedAssessment, JobListItem } from './types/jobs.types';
import { JobsSearchFilters, JobStatus } from './types/index.types';

function getSingleParam(
  searchParams: Record<string, string | string[] | undefined>,
  ...keys: string[]
) {
  for (const key of keys) {
    const value = searchParams[key];

    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value) && value.length > 0) {
      return value[0] ?? '';
    }
  }

  return '';
}

function getArrayParam(
  searchParams: Record<string, string | string[] | undefined>,
  ...keys: string[]
) {
  const values = keys.flatMap((key) => {
    const value = searchParams[key];

    if (typeof value === 'string') {
      return [value];
    }

    return Array.isArray(value) ? value : [];
  });

  return values.filter((value) => value.trim().length > 0);
}

export function normalizeJobsSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): JobsSearchFilters {
  const pageValue = Number.parseInt(getSingleParam(searchParams, 'page'), 10);
  const normalizedRoleCategories = getArrayParam(
    searchParams,
    'role_categories[]',
    'role_categories',
    'role_category_ids[]',
    'role_category_ids',
    'role_category_id',
  );
  const normalizedSeniorityLevels = normalizedRoleCategories.length
    ? getArrayParam(searchParams, 'seniority_levels[]', 'seniority_levels')
    : [];

  return {
    page: Number.isNaN(pageValue) || pageValue < 1 ? 1 : pageValue,
    search: getSingleParam(searchParams, 'search').trim(),
    country: getSingleParam(searchParams, 'country'),
    professionalLicenses: getArrayParam(
      searchParams,
      'professional_licenses[]',
      'professional_licenses',
      'professional_license',
    ),
    domains: getArrayParam(searchParams, 'domains[]', 'domains', 'domain'),
    minSalary: getSingleParam(searchParams, 'min_salary'),
    maxSalary: getSingleParam(searchParams, 'max_salary'),
    roleCategories: normalizedRoleCategories,
    seniorityLevels: normalizedSeniorityLevels,
    // specialties: getArrayParam(searchParams, "specialties[]", "specialties"),
    experiences: getArrayParam(searchParams, 'experiences[]', 'experiences'),
    availabilities: getArrayParam(
      searchParams,
      'availabilities[]',
      'availabilities',
    ),
    salaryTypes: getArrayParam(searchParams, 'salary_types[]', 'salary_types'),
    categories: getArrayParam(searchParams, 'categories[]', 'categories'),
    employmentTypes: getArrayParam(
      searchParams,
      'employment_types[]',
      'employment_types',
    ),
  };
}

export function buildJobsQueryString(filters: JobsSearchFilters) {
  const params = new URLSearchParams();
  const arrayFilters: Array<[string, string[]]> = [
    ['professional_licenses[]', filters.professionalLicenses],
    ['role_categories[]', filters.roleCategories],
    ['domains[]', filters.domains],
    ['seniority_levels[]', filters.seniorityLevels],
    // ["specialties[]", filters.specialties],
    ['experiences[]', filters.experiences],
    ['availabilities[]', filters.availabilities],
    ['salary_types[]', filters.salaryTypes],
    ['categories[]', filters.categories],
    ['employment_types[]', filters.employmentTypes],
  ];

  if (filters.page > 1) {
    params.set('page', String(filters.page));
  }

  if (filters.search) {
    params.set('search', filters.search);
  }

  if (filters.country) {
    params.set('country', filters.country);
  }

  if (filters.minSalary) {
    params.set('min_salary', filters.minSalary);
  }

  if (filters.maxSalary) {
    params.set('max_salary', filters.maxSalary);
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

  return `/${locale}/jobs${queryString ? `?${queryString}` : ''}`;
}

export function buildSavedJobsPagePath(locale: string, page: number) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set('page', String(page));
  }

  const queryString = params.toString();

  return `/${locale}/jobs/saved${queryString ? `?${queryString}` : ''}`;
}

export function buildCandidateApplicationsPagePath(
  locale: string,
  page: number,
) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set('page', String(page));
  }

  const queryString = params.toString();

  return `/${locale}/candidate/applications${queryString ? `?${queryString}` : ''}`;
}

export function getSiteOrigin() {
  const baseUrl = getBaseApiUrl();

  return baseUrl.replace(/\/api\/?$/, '');
}

export function getJobPostedAtLabel(date: string | null) {
  if (!date) {
    return 'Recently posted';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Recently posted';
  }

  return formatDistanceToNowStrict(parsedDate, { addSuffix: true });
}

export function getJobLocation(
  job: Pick<JobListItem | JobDetails, 'city' | 'country'>,
  locationNotSpecified = 'Location not specified',
) {
  return (
    [job.city?.name, job.country?.name].filter(Boolean).join(', ') ||
    locationNotSpecified
  );
}

function parseSalaryAmount(value: string | number | null | undefined) {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.replace(/,/g, '').trim();
  if (!normalizedValue) {
    return null;
  }

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

function formatSalaryAmount(value: string | number | null | undefined) {
  const parsedValue = parseSalaryAmount(value);
  return parsedValue == null ? null : parsedValue.toLocaleString('en-US');
}

type SalaryLike = {
  min_salary: string | number | null | undefined;
  max_salary: string | number | null | undefined;
  currency?: JobListItem['currency'] | JobDetails['currency'] | null;
  hasSalary?: boolean;
};

export function getJobSalary(job: SalaryLike, notSpecified = 'Not specified') {
  const minSalary = formatSalaryAmount(job.min_salary);
  const maxSalary = formatSalaryAmount(job.max_salary);
  const hasMinSalary = minSalary !== null;
  const hasMaxSalary = maxSalary !== null;

  if (hasMinSalary && hasMaxSalary) {
    return `${minSalary} - ${maxSalary}`;
  }

  if (hasMinSalary || hasMaxSalary) {
    return minSalary ?? maxSalary ?? notSpecified;
  }
  if (!job.hasSalary) return notSpecified;
  return notSpecified;
}
export function getJobSalaryWithCurrency(job: SalaryLike, notSpecified = 'Not specified') {
  const minSalary = formatSalaryAmount(job.min_salary);
  const maxSalary = formatSalaryAmount(job.max_salary);
  const hasMinSalary = minSalary !== null;
  const hasMaxSalary = maxSalary !== null;

  if (hasMinSalary && hasMaxSalary) {
    return `${minSalary}${job.currency?.code ? job.currency?.code : ''} - ${maxSalary}${job.currency?.code ? job.currency?.code : ''}`;
  }

  if (hasMinSalary || hasMaxSalary) {
    return minSalary ?? maxSalary ?? notSpecified;
  }

  return notSpecified;
}

export function normalizeJobStatus(
  status: string | null | undefined,
): JobStatus {
  switch (status?.toLowerCase()) {
    case 'closed':
      return 'closed';
    case 'paused':
    case 'pause':
      return 'paused';
    case 'draft':
      return 'draft';
    default:
      return 'open';
  }
}

export function truncateText(text: string, maxLength = 150) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
export function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

export function getCvDownloadFileName(name: string, cvUrl: string) {
  const urlPath = cvUrl.split('?')[0];
  const extension = urlPath.includes('.')
    ? `.${urlPath.split('.').pop() ?? 'pdf'}`
    : '.pdf';
  const safeName = name
    .replace(/[<>:"/\|?*\x00-\x1F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return `${safeName || 'candidate-cv'}${extension}`;
}

export function getJobCandidatesHref(jobId: string | number) {
  return `/company/job/candidates/${jobId}`;
}

export function getAiTalentMatchHref(jobId: string | number) {
  return `${getJobCandidatesHref(jobId)}?tab=ai-match`;
}

export function getPipelineFiltersHref(jobId: string | number, query = '') {
  return `${getJobCandidatesHref(jobId)}/filters${query ? `?${query}` : ''}`;
}

// "21 December 2026, 4:00 AM" in the active locale; returns '' for missing/invalid dates.
export function formatJobDateTime(value: string | null | undefined, locale: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function getEditJobHref(jobId: string | number) {
  return `/company/post-job?editId=${jobId}`;
}

// Opens a draft in the wizard (it starts at step 2, as in Figma).
export function getCompletePostHref(jobId: string | number) {
  return `/company/post-job?jobId=${jobId}`;
}

// "A", "B", … for answer options.
export function getOptionLetter(index: number) {
  return String.fromCharCode(65 + index);
}

export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

// Linked assessment shown in the wizard preview (preview seeds until the assessments API exists).
export function getLinkedAssessment(assessmentId?: string): JobLinkedAssessment | null {
  const assessment = assessmentSeeds.find((item) => item.id === assessmentId);
  return assessment
    ? { id: assessment.id, title: assessment.title, category_id: assessment.categoryId }
    : null;
}
