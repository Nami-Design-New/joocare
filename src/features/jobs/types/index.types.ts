export type JobStatus = "open" | "closed" | "paused";
export type Applicant = {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  cvUrl: string | null;
};

// Candidate jobs

export type JobsFilterOption = {
  value: string;
  label: string;
};

export type JobsFiltersData = {
  countries: JobsFilterOption[];
  categories: JobsFilterOption[];
  domains: JobsFilterOption[];
  specialties: JobsFilterOption[];
  experiences: JobsFilterOption[];
  availabilities: JobsFilterOption[];
  employmentTypes: JobsFilterOption[];
  roleCategories: JobsFilterOption[];
  salaryTypes: JobsFilterOption[];
  seniorityLevels: JobsFilterOption[];
  jobTitles: JobsFilterOption[];
};

export interface FilterState {
  professionalLicense: string;
  roleCategories: string[];
  seniorityLevels: string[];
  domains: string[];
  specialties: string[];
  experiences: string[];
  availabilities: string[];
  categories: string[];
  employmentTypes: string[];
  salaryTypes: string[];
  salaryMin: string;
  salaryMax: string;
}

export interface AccordionSection {
  key: keyof Omit<FilterState, "salaryMin" | "salaryMax">;
  label: string;
  name: string;
  options: JobsFilterOption[];
  type?: "checkbox" | "radio";
}


export type JobsSearchFilters = {
  page: number;
  search: string;
  country: string;
  professionalLicense: string;
  domain: string;
  minSalary: string;
  maxSalary: string;
  roleCategories: string[];
  seniorityLevels: string[];
  specialties: string[];
  experiences: string[];
  availabilities: string[];
  salaryTypes: string[];
  categories: string[];
  employmentTypes: string[];
};
