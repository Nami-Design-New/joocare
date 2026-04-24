export type CandidateProfileApiLookup = {
  id: number;
  name?: string;
  title?: string;
  code?: string;
  country_id?: number;
  created_at?: string;
  updated_at?: string;
};

export type CandidateProfileApiResponsibility = {
  id: number;
  user_experience_id: number;
  description: string;
  created_at: string;
  updated_at: string;
};

export type CandidateProfileApiExperience = {
  id: number;
  title: string;
  job_title_id: number | null;
  company: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  user_id: number;
  responsibilities: CandidateProfileApiResponsibility[];
  created_at: string;
  updated_at: string;
};

export type CandidateProfileApiSkill = {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
};

export type CandidateProfileApiEducation = {
  id: number;
  user_id: number;
  degree: string | null;
  university: string | null;
  gpa?: number | string | null;
  country_id: number | null;
  start_date: string | null;
  end_date: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
};

export type CandidateProfileApiUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  phone_code: string | null;
  job_title_id: number | null;
  title: CandidateProfileApiLookup | string | null;
  country_id: number | null;
  country: CandidateProfileApiLookup | null;
  city_id: number | null;
  city: CandidateProfileApiLookup | null;
  specialty_id: number | null;
  specialty: CandidateProfileApiLookup | null;
  cv: string | null;
  image: string | null;
  experience_id: number | null;
  experience: CandidateProfileApiLookup | null;
  age: number | string | null;
  bio: string | null;
  is_profile_complete: boolean | null;
  licenses: unknown[];
  certifications: unknown[];
  qualifications: unknown[];
  experiences: CandidateProfileApiExperience[];
  skills: CandidateProfileApiSkill[];
  educations: CandidateProfileApiEducation[];
  birth_date?: string | null;
  date_of_birth?: string | null;
  created_at: string;
  updated_at: string;
  hiring_readiness_score?: number | null;
};

export type CandidateProfileApiResponse = {
  data: CandidateProfileApiUser;
  message: string;
};

export type CandidateProfileViewModel = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  phoneCode: string | null;
  fullPhone: string | null;
  jobTitleId?: string | null;
  specialtyId?: string | null;
  experienceId?: string | null;
  countryId?: string | null;
  cityId?: string | null;
  birthDate?: string | null;
  image: string | null;
  cv: string | null;
  bio: string | null;
  age: number | null;
  location: string | null;
  jobTitle: string | null;
  experience: string | null;
  isProfileComplete: boolean | null;
  skills: CandidateSkillViewModel[];
  educations: CandidateEducationViewModel[];
  experiences: CandidateExperienceViewModel[];
  hiring_readiness_score?: number | null;
};

export type CandidateSkillViewModel = {
  id: string;
  label: string;
  deleteId?: string;
};

export type CandidateEducationViewModel = {
  id: string;
  university: string;
  degree: string | null;
  gpa: string | null;
  period: string | null;
  countryId: string | null;
  startDate: string | null;
  endDate: string | null;
};

export type CandidateExperienceViewModel = {
  id: string;
  title: string;
  organization: string | null;
  startDate: string | null;
  endDate: string | null;
  startDateLabel: string | null;
  endDateLabel: string | null;
  isCurrent: boolean;
  bullets: string[];
};
