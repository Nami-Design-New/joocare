// ==============================
// BASE / SHARED ENTITIES
// ==============================

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

export type CompanyBase = {
  id: number;
  name: string | null;
  image: string | null;
  cover: string | null;
};

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
  company: CompanyDetails;

  title: string | null;

  job_title_id: number;
  job_title: NamedEntity;

  license_id: number;
  license: NamedEntity;

  specialty_id: number;
  specialty: WithCategory;

  employment_type_id: number;
  employment_type: NamedEntity;

  role_category_id: number;
  role_category: NamedEntity;

  category_id: number;
  category: NamedEntity;

  seniority_level_id: number;
  seniority_level: NamedEntity;

  country_id: number;
  country: Country;

  city_id: number | null;
  city: City | null;

  experience_id: number;
  experience: NamedEntity;

  eduction_level_id: number;
  eduction_level: NamedEntity;

  availability_id: number;
  availability: NamedEntity;

  description: string;

  professional_license: string;

  has_salary: number;
  min_salary: string;
  max_salary: string;

  status: string;
  applications_count: number;

  currency_id: number;
  currency: Currency;

  salary_type_id: number;
  salary_type: NamedEntity;

  skills: NamedEntity[];
  mandatory_certifications: NamedEntity[];

  current_status: {
    id: number;
    job_id: number;
    status: string;
    created_at: string;
    updated_at: string;
  };

  applications: unknown[];

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

export type JobDetailsResponse = {
  message: string;
  data: {
    job: JobDetails;
    similar_jobs: SimilarJob[];
  };
};
