import type { Option } from '@/shared/components/SelectInputField';
import type { JobMatch } from '../types/ai-job-match.types';

// Local design fixtures until the AI job match API is ready. Values are shown as is (not translated).
const COMPANY_LOGO = '/assets/new-logo-dot.svg';
const HIGHLIGHTS = ['3 Years Experience', 'Pharmaceutical Industry'];

export const JOB_MATCH_PREVIEW_TOTAL = 57;

export const JOB_MATCH_PREVIEW: JobMatch[] = [
  {
    id: 'match-1',
    title: 'Medical Approval',
    companyName: 'Saudi German Hospital',
    companyLogo: COMPANY_LOGO,
    location: 'Cairo',
    salary: '$2K-$4K',
    employmentType: 'Full Time',
    score: 92,
    highlights: HIGHLIGHTS,
  },
  {
    id: 'match-2',
    title: 'Medical Approval',
    companyName: 'Saudi German Hospital',
    companyLogo: COMPANY_LOGO,
    location: 'Cairo',
    salary: '$2K-$4K',
    employmentType: 'Full Time',
    score: 78,
    highlights: HIGHLIGHTS,
  },
  {
    id: 'match-3',
    title: 'Staff Nurse – ICU',
    companyName: 'Dr. Sulaiman Al Habib',
    companyLogo: COMPANY_LOGO,
    location: 'Cairo',
    salary: '$2K-$4K',
    employmentType: 'Full Time',
    score: 62,
    highlights: HIGHLIGHTS,
  },
  {
    id: 'match-4',
    title: 'Clinical Pharmacist',
    companyName: 'Cleopatra Hospitals',
    companyLogo: COMPANY_LOGO,
    location: 'Cairo',
    salary: '$2K-$4K',
    employmentType: 'Full Time',
    score: 47,
    highlights: HIGHLIGHTS,
  },
];

// No companies lookup exists yet, so the "Preferred Companies" options are fixtures too.
export const PREFERRED_COMPANY_OPTIONS: Option[] = [
  { value: 'pfizer', label: 'Pfizer' },
  { value: 'merck', label: 'Merck' },
  { value: 'cleveland-clinic', label: 'Cleveland Clinic' },
  { value: 'saudi-german-hospital', label: 'Saudi German Hospital' },
  { value: 'dr-sulaiman-al-habib', label: 'Dr. Sulaiman Al Habib' },
  { value: 'cleopatra-hospitals', label: 'Cleopatra Hospitals' },
];
