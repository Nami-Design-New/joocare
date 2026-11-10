import type { CertificateViewModel } from '@/features/candidate-credentials/types/certificate.types';
import type { LicenseViewModel } from '@/features/candidate-credentials/types/license.types';
import type { QualificationViewModel } from '@/features/candidate-credentials/types/qualification.types';
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
  lastActive: string;
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
