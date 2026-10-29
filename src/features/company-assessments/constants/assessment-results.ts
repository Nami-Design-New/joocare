import type {
  AssessmentResultAssessment,
  AssessmentResultCategory,
  CandidateLinkTarget,
} from '../types/assessment-results.types';

// Preview data until the assessment results and linking APIs are available.
export const assessmentResultCategories: AssessmentResultCategory[] = [
  { id: 'clinical-knowledge', name: 'Clinical Knowledge' },
  { id: 'nursing-knowledge', name: 'Nursing Knowledge' },
  { id: 'patient-safety', name: 'Patient Safety' },
];

export const assessmentResultAssessments: AssessmentResultAssessment[] = [
  {
    id: 'icu-nurses',
    categoryId: 'clinical-knowledge',
    name: 'Clinical Knowledge Assessment – ICU Nurses',
  },
  {
    id: 'emergency-physicians',
    categoryId: 'clinical-knowledge',
    name: 'Emergency Physician Assessment',
  },
  {
    id: 'emergency-nurses',
    categoryId: 'nursing-knowledge',
    name: 'Emergency Nursing Assessment',
  },
  {
    id: 'patient-safety-basics',
    categoryId: 'patient-safety',
    name: 'Patient Safety Assessment',
  },
];

export const candidateLinkTargets: Record<
  'job' | 'project',
  CandidateLinkTarget[]
> = {
  job: [
    {
      id: 'staff-nurse-icu',
      name: 'Staff Nurse – ICU',
      organization: 'King Fahd Medical City',
      location: 'Riyadh',
      associatedCount: 34,
    },
    {
      id: 'senior-clinical-pharmacist',
      name: 'Senior Clinical Pharmacist',
      organization: 'Dr. Sulaiman Al Habib Hospital',
      location: 'Jeddah',
      associatedCount: 12,
    },
    {
      id: 'er-registered-nurse',
      name: 'ER Registered Nurse',
      organization: 'Saudi German Hospital',
      location: 'Dammam',
      associatedCount: 21,
      alreadyLinked: true,
    },
    {
      id: 'home-care-nurse',
      name: 'Home-care Nurse',
      organization: 'Cleveland Clinic Abu Dhabi',
      location: 'Abu Dhabi',
      associatedCount: 8,
    },
  ],
  project: [
    {
      id: 'icu-staffing-q4-2026',
      name: 'ICU Staffing – Q4 2026',
      organization: 'King Fahd Medical City',
      location: '',
      associatedCount: 18,
    },
    {
      id: 'pharmacy-network-expansion',
      name: 'Pharmacy Network Expansion',
      organization: 'Dr. Sulaiman Al Habib Hospital',
      location: '',
      associatedCount: 9,
    },
    {
      id: 'hajj-season-medical-team-2027',
      name: 'Hajj Season Medical Team 2027',
      organization: 'Ministry of Health – Makkah',
      location: '',
      associatedCount: 42,
      alreadyLinked: true,
    },
    {
      id: 'home-care-nursing-program',
      name: 'Home-care Nursing Program',
      organization: 'Cleveland Clinic Abu Dhabi',
      location: '',
      associatedCount: 6,
    },
  ],
};

export const LINKING_RECRUITER_NAME = 'Mona Al-Harbi (Recruiter)';
