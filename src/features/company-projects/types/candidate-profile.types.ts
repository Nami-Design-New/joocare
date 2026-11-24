import type {
  CertificateApiItem,
  CertificateViewModel,
} from '@/features/candidate-credentials/types/certificate.types';
import type {
  LicenseApiItem,
  LicenseViewModel,
} from '@/features/candidate-credentials/types/license.types';
import type {
  QualificationApiItem,
  QualificationViewModel,
} from '@/features/candidate-credentials/types/qualification.types';
import type { CandidateProfileViewModel } from '@/features/candidate-profile/types/profile.types';

export type CandidateProfileDetailKey =
  | 'email'
  | 'location'
  | 'phone'
  | 'experience'
  | 'specialty'
  | 'subspecialty'
  | 'age'
  | 'gender'
  | 'religion'
  | 'marital-status';

export type CandidateProfileDetail = {
  key: CandidateProfileDetailKey;
  value: string;
};

export type CandidateCareerPreferences = {
  desiredDesignations: string[];
  preferredWorkLocations: string[];
  desiredIndustries: string[];
  noticePeriod: string;
  willingToRelocate: string;
};

export type CandidateProfileSummary = {
  isOpenToWork: boolean;
  /** Hidden when the API has no value. */
  lastActive: string | null;
  details: CandidateProfileDetail[];
  languages: string[];
  drivingLicense: string;
  licenseCountries: string[];
};

export type ProjectCandidateProfile = {
  profile: CandidateProfileViewModel;
  summary: CandidateProfileSummary;
  careerPreferences: CandidateCareerPreferences;
  clinicalPrivileges: string[];
  qualifications: QualificationViewModel[];
  certificates: CertificateViewModel[];
  licenses: LicenseViewModel[];
};

export type CandidateCredentialTab =
  | 'qualifications'
  | 'certificates'
  | 'licenses';

// GET /company/users/{id}/profile (candidate profile as a company sees it).

type ProfileLookupApiItem = {
  id: number;
  title?: string | null;
  name?: string | null;
};

export type CandidateProfileApiItem = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  phone_code: string | null;
  /** Stored path ("images/…"). */
  image: string | null;
  cv: string | null;
  bio: string | null;
  age: string | number | null;
  birth_date: string | null;
  gender: string | null;
  marital_status: string | null;
  country: ProfileLookupApiItem | null;
  city: ProfileLookupApiItem | null;
  nationality: ProfileLookupApiItem | null;
  job_title: ProfileLookupApiItem | null;
  title: string | null;
  specialty: ProfileLookupApiItem | null;
  subspecialty: ProfileLookupApiItem | null;
  experience: ProfileLookupApiItem | null;
  religion: ProfileLookupApiItem | null;
  experiences: {
    id: number;
    title: string | null;
    job_title?: ProfileLookupApiItem | null;
    company: string | null;
    start_date: string | null;
    end_date: string | null;
    is_current: boolean;
    responsibilities?: { description: string }[];
  }[];
  educations: {
    id: number;
    degree: string | null;
    gpa: string | null;
    university: string | null;
    country_id: number | null;
    start_date: string | null;
    end_date: string | null;
  }[];
  skills: ProfileLookupApiItem[];
  languages: {
    id: number;
    language: string;
    proficiency_level: string | null;
  }[];
  certifications: CertificateApiItem[];
  qualifications: QualificationApiItem[];
  licenses: LicenseApiItem[];
  clinical_privileges: ProfileLookupApiItem[];
  relocation_countries: ProfileLookupApiItem[];
  driving_license_countries: ProfileLookupApiItem[];
};

export type CandidateProfileLabels = {
  locale: string;
  present: string;
  yes: string;
  no: string;
  /** Translated enum value (gender, marital status, language level). */
  value: (group: 'gender' | 'marital' | 'proficiency', value: string) => string;
};
