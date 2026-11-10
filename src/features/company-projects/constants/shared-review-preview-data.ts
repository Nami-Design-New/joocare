import type {
  InterviewMethod,
  SharedReviewCandidate,
} from '../types/shared-review.types';
import { SAMPLE_CV_URL } from './project-preview-data';

export const SHARED_REVIEW_PAGE_SIZE = 9;

export const ALL_STATUSES_VALUE = 'all';

export const INTERVIEW_METHODS = [
  'online',
  'face-to-face',
] as const satisfies readonly InterviewMethod[];

const CANDIDATE_IMAGE = '/assets/company-projects/candidate-profile.png';

const reviewCandidates: Omit<SharedReviewCandidate, 'id' | 'image' | 'cv'>[] = [
  {
    name: 'Amira Mansour',
    specialty: 'Emergency Physician',
    nationality: 'Egypt',
    experience: '8 Yrs Exp',
    phone: '966 5462123331',
    email: 'amira.mansour@gmail.com',
    status: 'Shortlist',
    assessment: 'Passed',
  },
  {
    name: 'Omar Al-Farsi',
    specialty: 'Cardiologist',
    nationality: 'Saudi',
    experience: '12 Yrs Exp',
    phone: '966 5551234567',
    email: 'omar.alfarsi@gmail.com',
    status: 'Under review',
    assessment: 'Passed',
  },
  {
    name: 'Lina Haddad',
    specialty: 'Pediatric Nurse',
    nationality: 'Jordanian',
    experience: '5 Yrs Exp',
    phone: '962 798765432',
    email: 'lina.haddad@gmail.com',
    status: 'Rejected',
    assessment: 'Failed',
  },
  {
    name: 'Faisal Al-Mutairi',
    specialty: 'Radiologist',
    nationality: 'Kuwaiti',
    experience: '10 Yrs Exp',
    phone: '965 987654321',
    email: 'faisal.almutairi@gmail.com',
    status: 'Under review',
    assessment: 'Not assigned',
  },
  {
    name: 'Sara El-Sayed',
    specialty: 'Gynecologist',
    nationality: 'Egyptian',
    experience: '7 Yrs Exp',
    phone: '20 1234567890',
    email: 'sara.elsayed@gmail.com',
    status: 'Under review',
    assessment: 'Passed',
  },
  {
    name: 'Adel Nasser',
    specialty: 'Orthopedic Surgeon',
    nationality: 'Emirati',
    experience: '15 Yrs Exp',
    phone: '971 555444333',
    email: 'adel.nasser@gmail.com',
    status: 'Shortlist',
    assessment: 'Passed',
  },
  {
    name: 'Mona Al-Harthy',
    specialty: 'Clinical Pharmacist',
    nationality: 'Omani',
    experience: '6 Yrs Exp',
    phone: '968 991122334',
    email: 'mona.alharthy@gmail.com',
    status: 'Under review',
    assessment: 'Not assigned',
  },
  {
    name: 'Yousef Ghanem',
    specialty: 'Neurologist',
    nationality: 'Lebanese',
    experience: '11 Yrs Exp',
    phone: '961 701234567',
    email: 'yousef.ghanem@gmail.com',
    status: 'Rejected',
    assessment: 'Failed',
  },
  {
    name: 'Rania Kassem',
    specialty: 'Dermatologist',
    nationality: 'Syrian',
    experience: '9 Yrs Exp',
    phone: '963 933221144',
    email: 'rania.kassem@gmail.com',
    status: 'Under review',
    assessment: 'Passed',
  },
];

// Repeats the Figma sample three times to fill the 27-candidate preview.
export const sharedReviewCandidatesPreview: SharedReviewCandidate[] = [
  1, 2, 3,
].flatMap((round) =>
  reviewCandidates.map((candidate, index) => ({
    ...candidate,
    id: `review-candidate-${round}-${index + 1}`,
    image: CANDIDATE_IMAGE,
    cv: SAMPLE_CV_URL,
    status: round === 1 ? candidate.status : 'Under review',
  })),
);
