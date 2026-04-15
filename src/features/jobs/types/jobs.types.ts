// ==============================
// BASE / SHARED ENTITIES
// ==============================

import { CompanyBase } from "@/features/shared-company-profile/company-profile.type";

export type NamedEntity = {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
};

export type WithCategory = {
  id: number;
  title: string;
  category_id: number;
  created_at: string;
  updated_at: string;
};

export type Country = {
  id: number;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
};

export type City = {
  id: number;
  name: string;
  country_id: number;
  created_at: string;
  updated_at: string;
};

export type Currency = {
  id: number;
  title: string;
  code: string;
  created_at: string;
  updated_at: string;
};

// ==============================
// COMPANY
// ==============================



export type CompanyDetails = CompanyBase & {
  email: string;
  phone: string;
  phone_code: string;

  person_name: string;
  person_phone: string;
  person_phone_code: string;

  domain_id: number;
  domain: NamedEntity;
  country_id: number;
  city_id: number;

  bio: string;
  established_date: string;

  commercial_registration_number: string;
  commercial_registration_issue_date: string;
  commercial_registration_expiry_date: string;
  commercial_registration_image: string;

  license_issue_country_id: number;
  organization_size_id: number;
  employer_type_id: number;

  medical_facility_license_number: string;
  license_issuing_authority: string;

  specialty_id: number;

  medical_license_issue_date: string;
  medical_license_expiry_date: string;
  medical_license_image: string;

  website: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  snapchat: string;

  status: string;
  rejection_reason: string | null;

  is_active: number;

  created_at: string;
  updated_at: string;
};

// ==============================
// JOB (LIGHT - LISTING)
// ==============================

export type JobListItem = {
  id: number;
  title: string | null;

  job_title_id: number | null;
  job_title: NamedEntity | null;

  company: CompanyBase | null;

  country: Country | null;
  city: City | null;

  experience: NamedEntity | null;
  employment_type: NamedEntity | null;
  specialty: WithCategory | null;

  currency_id: number | null;
  currency: Currency | null;

  salary_type_id: number | null;
  salary_type: NamedEntity | null;

  min_salary: string | null;
  max_salary: string | null;

  description: string | null;
  category: NamedEntity | null;

  is_applied: boolean;
  is_saved: boolean;

  created_at: string;
  updated_at: string;
};

// ==============================
// JOB (FULL - DETAILS)
// ==============================

export type JobDetails = {
  id: number;
  company_id: number;
  company: CompanyDetails | null;

  title: string | null;

  job_title_id: number | null;
  job_title: NamedEntity | null;

  license_id: number | null;
  license: NamedEntity | null;

  specialty_id: number | null;
  specialty: WithCategory | null;

  employment_type_id: number | null;
  employment_type: NamedEntity | null;

  role_category_id: number | null;
  role_category: NamedEntity | null;

  category_id: number | null;
  category: NamedEntity | null;

  seniority_level_id: number | null;
  seniority_level: NamedEntity | null;

  country_id: number | null;
  country: Country | null;

  city_id: number | null;
  city: City | null;

  experience_id: number | null;
  experience: NamedEntity | null;

  education_levels: [];

  availability_id: number | null;
  availability: NamedEntity | null;

  description: string | null;

  professional_license: string | null;

  has_salary: number;
  min_salary: string | null;
  max_salary: string | null;

  status: string;
  applications_count: number;

  currency_id: number | null;
  currency: Currency | null;

  salary_type_id: number | null;
  salary_type: NamedEntity | null;

  skills: NamedEntity[];
  mandatory_certifications: NamedEntity[];

  current_status: {
    id: number;
    job_id: number;
    status: string;
    created_at: string;
    updated_at: string;
  } | null;

  applications: Array<{
    id: number;
    user_id: number;
    job_id: number;
    cv: string | null;
    created_at: string;
    updated_at: string;
  }>;

  is_applied: boolean;
  is_saved: boolean;

  created_at: string;
  updated_at: string;
};

// ==============================
// SIMILAR JOBS
// ==============================

export type SimilarJob = JobListItem

// ==============================
// API RESPONSES
// ==============================

export type CandidateApplicationItem = {
  id: number;
  user_id: number;
  job_id: number;
  job: JobListItem;
  cv: string | null;
  created_at: string;
  updated_at: string;
};

export type JobsListingResponse = {
  message: string;
  code: number;
  data: JobListItem[];

  current_page: number;
  last_page: number;
  per_page: number;
  total: number;

  next_page_url: string | null;
  prev_page_url: string | null;
};

export type CandidateApplicationsResponse = {
  message: string;
  code: number;
  data: CandidateApplicationItem[];

  current_page: number;
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};

export type JobDetailsResponse = {
  message: string;
  data: {
    job: JobDetails;
    similar_jobs?: SimilarJob[];
  };
};
