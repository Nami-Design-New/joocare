import { projectPreviewData } from '@/features/company-projects/constants/project-preview-data';
import type {
  RecruiterActivity,
  RecruiterJobStatus,
} from '../types/recruiter-activity.types';

export const RECRUITER_ACTIVITY_PAGE_SIZE = 10;

export const ALL_RECRUITERS_VALUE = 'all';

export const RECRUITER_JOB_STATUSES: RecruiterJobStatus[] = [
  'open',
  'closed',
  'draft',
];

const countProjects = (recruiter: string) =>
  projectPreviewData.filter((project) => project.recruiter === recruiter)
    .length;

const recruiters: Omit<RecruiterActivity, 'projects'>[] = [
  {
    id: 'sara-al-qahtani',
    name: 'Sara Al-Qahtani',
    isDeleted: false,
    jobs: { open: 14, closed: 22, draft: 5 },
  },
  {
    id: 'omar-farouk',
    name: 'Omar Farouk',
    isDeleted: false,
    jobs: { open: 9, closed: 17, draft: 3 },
  },
  {
    id: 'nora-al-otaibi',
    name: 'Nora Al-Otaibi',
    isDeleted: false,
    jobs: { open: 6, closed: 11, draft: 2 },
  },
  {
    id: 'layla-mansour',
    name: 'Layla Mansour',
    isDeleted: false,
    jobs: { open: 4, closed: 8, draft: 1 },
  },
  {
    id: 'khaled-nasser',
    name: 'Khaled Nasser',
    isDeleted: true,
    jobs: { open: 0, closed: 12, draft: 0 },
  },
];

// Preview data until the recruiter activity API is ready.
export const recruiterActivityPreview: RecruiterActivity[] = recruiters.map(
  (recruiter) => ({ ...recruiter, projects: countProjects(recruiter.name) }),
);
