// `GET USER/profile-details` response. Lookups come back as `{ id, name | title }`;
// fixed choices come back as `{ value, label }` and are narrowed in the mapper.

export type ProfileDetailsLookup = {
  id: number | string;
  name?: string;
  title?: string;
  code?: string;
};

export type ProfileDetails = {
  occupational?: {
    domain?: ProfileDetailsLookup | null;
  };
  qualifications?: {
    experience?: ProfileDetailsLookup | null;
    current_role_experience?: ProfileDetailsLookup | null;
    seniority_level?: ProfileDetailsLookup | null;
    education_level?: ProfileDetailsLookup | null;
    mandatory_certifications?: ProfileDetailsLookup[];
    license?: {
      id: number;
      number: string | null;
      country?: ProfileDetailsLookup | null;
      status?: unknown;
      verification_status?: unknown;
    } | null;
  };
  languages?: unknown[];
  mobility?: {
    willing_to_relocate?: unknown;
    relocation_countries?: ProfileDetailsLookup[];
    has_driving_license?: unknown;
    driving_license_countries?: ProfileDetailsLookup[];
  };
  career_preferences?: {
    job_titles?: ProfileDetailsLookup[];
    domains?: ProfileDetailsLookup[];
    preferred_countries?: ProfileDetailsLookup[];
    availability?: ProfileDetailsLookup | null;
    job_search_status?: unknown;
  };
  clinical_privileges?: unknown[];
  personal_details?: {
    nationality?: ProfileDetailsLookup | null;
    country?: ProfileDetailsLookup | null;
    city?: ProfileDetailsLookup | null;
    gender?: unknown;
    marital_status?: unknown;
    visa_status?: unknown;
    sponsorship_requirement?: unknown;
  };
  salary?: {
    current_salary?: number | string | null;
    current_salary_currency?: ProfileDetailsLookup | null;
    expected_salary_min?: number | string | null;
    expected_salary_max?: number | string | null;
    expected_salary_currency?: ProfileDetailsLookup | null;
  };
};
