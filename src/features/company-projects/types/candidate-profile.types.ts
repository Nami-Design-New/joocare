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
import type { CANDIDATE_JOB_SEARCH_STATUSES } from '../constants/candidate-job-search-status';

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

export type CandidateProfilePlaceholder = '-' | '#';

export type CandidateProfileList = string[] | CandidateProfilePlaceholder;

export type CandidateCareerPreferences = {
  desiredDesignations: CandidateProfileList;
  preferredWorkLocations: CandidateProfileList;
  desiredIndustries: CandidateProfileList;
  noticePeriod: string;
  willingToRelocate: string;
};

export type CandidateJobSearchStatus =
  (typeof CANDIDATE_JOB_SEARCH_STATUSES)[number]['value'];

export type CandidateProfileSummary = {
  jobSearchStatus?: CandidateJobSearchStatus;
  jobSearchStatusPlaceholder?: CandidateProfilePlaceholder;
  lastActive: string | null;
  details: CandidateProfileDetail[];
  languages: CandidateProfileList;
  drivingLicense: string;
  licenseCountries: CandidateProfileList;
};

export type ProjectCandidateProfile = {
  profile: CandidateProfileViewModel;
  summary: CandidateProfileSummary;
  careerPreferences: CandidateCareerPreferences;
  clinicalPrivileges: CandidateProfileList;
  qualifications: QualificationViewModel[];
  certificates: CertificateViewModel[];
  licenses: LicenseViewModel[];
  sectionPlaceholders?: Partial<
    Record<
      'educations' | 'skills' | 'experiences' | CandidateCredentialTab,
      CandidateProfilePlaceholder
    >
  >;
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
  domain?: ProfileLookupApiItem | null;
  last_active_at?: string | null;
  has_driving_license?: boolean | null;
  willing_to_relocate?: boolean | null;
  preference?: {
    job_search_status?: string | { value?: string | null } | null;
    desired_designations?: ProfileLookupApiItem[] | null;
    notice_period?: string | ProfileLookupApiItem | null;
  } | null;
  experiences?:
    | {
        id: number;
        title: string | null;
        job_title?: ProfileLookupApiItem | null;
        company: string | null;
        start_date: string | null;
        end_date: string | null;
        is_current: boolean;
        responsibilities?: { description?: string | null }[] | null;
      }[]
    | null;
  educations?:
    | {
        id: number;
        degree: string | null;
        gpa: string | null;
        university: string | null;
        country_id: number | null;
        start_date: string | null;
        end_date: string | null;
      }[]
    | null;
  skills?: ProfileLookupApiItem[] | null;
  languages?:
    | {
        id: number;
        language: string;
        proficiency_level: string | null;
      }[]
    | null;
  certifications?: CertificateApiItem[] | null;
  qualifications?: QualificationApiItem[] | null;
  licenses?: LicenseApiItem[] | null;
  clinical_privileges?: ProfileLookupApiItem[] | null;
  relocation_countries?: ProfileLookupApiItem[] | null;
  driving_license_countries?: ProfileLookupApiItem[] | null;
};

export type CandidateProfileLabels = {
  locale: string;
  present: string;
  yes: string;
  no: string;
  /** Translated enum value (gender, marital status, language level). */
  value: (group: 'gender' | 'marital' | 'proficiency', value: string) => string;
};
