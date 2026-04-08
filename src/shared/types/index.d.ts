export interface IUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  phone_code: string;
  job_title_id: number | null;
  job_title: string | null;
  country_id: number | null;
  country: string | null;
  city_id: number | null;
  city: string | null;
  cv: string | null;
  image: string | null;
  experience_id: number | null;
  age: number | null;
  bio: string | null;
  licenses: [key: string];
  certifications: [key: string];
  qualifications: [key: string];
  experiences: [key: string];
  educations: [key: string];
  created_at: string;
  updated_at: string;
}

export interface ICompanyUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  phone_code: string | null;
  domain: string | null;
  domain_id: number | null;
  person_name: string | null;
  person_phone: string | null;
  person_phone_code: string | null;
  country_id: number | null;
  city_id: number | null;
  bio: string | null;
  established_date: string | null;
  commercial_registration_number: string | null;
  commercial_registration_issue_date: string | null;
  commercial_registration_expiry_date: string | null;
  commercial_registration_image: string | null;
  license_issue_country_id: number | null;
  organization_size_id: number | null;
  employer_type_id: number | null;
  medical_facility_license_number: string | null;
  license_issuing_authority: string | null;
  specialty_id: number | null;
  medical_license_issue_date: string | null;
  medical_license_expiry_date: string | null;
  medical_license_image: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  instagram: string | null;
  snapchat: string | null;
  image: string | null;
  cover: string | null;
  created_at: string;
  updated_at: string;
}

export type AuthSessionUser = IUser | ICompanyUser;
