export type MatchLevel = 'high' | 'good' | 'review' | 'limited' | 'low';

export type MatchLevelRange = {
  level: MatchLevel;
  min: number;
  max: number;
};

export type JobMatch = {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  location: string;
  salary: string;
  employmentType: string;
  /** AI match score, 0–100. */
  score: number;
  highlights: string[];
};

export type JobPreferences = {
  domainIds: string[];
  /** A role category id, or `JOB_FUNCTION_BOTH`. */
  jobFunction: string;
  jobTitleIds: string[];
  jobTitleOptions: JobPreferenceOption[];
  companyIds: string[];
  companyOptions: JobPreferenceOption[];
  countryId: string;
  countryOption: JobPreferenceOption | null;
  seniorityLevelIds: string[];
  highMatchOnly: boolean;
};

export type JobPreferenceOption = {
  value: string;
  label: string;
};

export type ApiJobPreferences = {
  job_function?: string | null;
  country_id?: number | string | null;
  is_only_high?: boolean | number | string | null;
  domain_ids?: Array<number | string> | null;
  job_title_ids?: Array<number | string> | null;
  company_ids?: Array<number | string> | null;
  seniority_level_ids?: Array<number | string> | null;
  domains?: ApiPreferenceReference[] | null;
  job_titles?: ApiPreferenceReference[] | null;
  companies?: ApiPreferenceReference[] | null;
  seniority_levels?: ApiPreferenceReference[] | null;
  country?: ApiPreferenceLookup | null;
};

export type ApiPreferenceReference = {
  id: number | string;
  domain?: ApiPreferenceLookup;
  job_title?: ApiPreferenceLookup;
  company?: ApiPreferenceLookup;
  seniority_level?: ApiPreferenceLookup;
};

export type ApiPreferenceLookup = {
  id: number | string;
  title?: string;
  name?: string;
};

export type ApiJobPreferencesResponse =
  | ApiJobPreferences
  | { preference?: ApiJobPreferences }
  | [];

export type ApiRecommendedJob = {
  id: number | string;
  title?: string | null;
  job_title?: ApiPreferenceLookup | null;
  company?: {
    name?: string | null;
    image?: string | null;
  } | null;
  country?: ApiPreferenceLookup | null;
  city?: ApiPreferenceLookup | null;
  employment_type?: ApiPreferenceLookup | null;
  experience?: ApiPreferenceLookup | null;
  specialty?: ApiPreferenceLookup | null;
  currency?: {
    symbol?: string | null;
    code?: string | null;
    title?: string | null;
  } | null;
  has_salary?: boolean | number | null;
  min_salary?: string | number | null;
  max_salary?: string | number | null;
  match_score?: number | string | null;
  score?: number | string | null;
};

export type RecommendedJobsPage = {
  jobs: JobMatch[];
  currentPage: number;
  perPage: number;
  total: number;
};

export type JobPreferencesMode = 'add' | 'edit';
