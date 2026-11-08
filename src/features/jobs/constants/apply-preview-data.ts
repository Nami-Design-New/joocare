import type { ApplyScreeningQuestion } from '../types/job-apply.types';
import type { JobLinkedAssessment } from '../types/jobs.types';

// Design preview data until the job details API returns screening questions and the linked
// assessment (mock data, not translated). Turn off with `JOB_APPLY_PREVIEW_ENABLED`.
const yesNoOptions = [
  { id: 'yes', text: 'Yes' },
  { id: 'no', text: 'No' },
];

export const APPLY_PREVIEW_SCREENING_QUESTIONS: ApplyScreeningQuestion[] = [
  {
    id: 'available-immediately',
    type: 'yes-no',
    question: 'Are you available to join immediately?',
    options: yesNoOptions,
    required: true,
  },
  {
    id: 'notice-period',
    type: 'single',
    question: 'What is your notice period?',
    options: [
      { id: 'immediately', text: 'Immediately available' },
      { id: '1-month', text: '1 month' },
      { id: '2-months', text: '2 months' },
      { id: '3-months', text: '3 months or more' },
    ],
    required: true,
  },
  {
    id: 'clinical-areas',
    type: 'multi',
    question: 'Which clinical areas do you have hands-on experience in?',
    options: [
      { id: 'icu', text: 'Intensive Care Unit (ICU)' },
      { id: 'emergency', text: 'Emergency Department' },
      { id: 'paediatrics', text: 'Paediatrics' },
      { id: 'cardiology', text: 'Cardiology / CCU' },
    ],
    required: true,
  },
  {
    id: 'bls-acls',
    type: 'yes-no',
    question: 'Do you hold a valid BLS / ACLS certification?',
    options: yesNoOptions,
    required: true,
  },
  {
    id: 'nursing-experience',
    type: 'single',
    question: 'How many years of nursing experience do you have?',
    options: [
      { id: 'under-2', text: 'Less than 2 years' },
      { id: '2-5', text: '2 – 5 years' },
      { id: '5-10', text: '5 – 10 years' },
      { id: 'over-10', text: 'More than 10 years' },
    ],
    required: true,
  },
  {
    id: 'night-shifts',
    type: 'yes-no',
    question: 'Are you willing to work rotating night shifts?',
    options: yesNoOptions,
    required: true,
  },
  {
    id: 'languages',
    type: 'multi',
    question: 'Which languages can you communicate with patients in?',
    options: [
      { id: 'arabic', text: 'Arabic' },
      { id: 'english', text: 'English' },
      { id: 'urdu', text: 'Urdu' },
      { id: 'tagalog', text: 'Tagalog' },
    ],
    required: false,
  },
  {
    id: 'expected-salary',
    type: 'single',
    question: 'What is your expected monthly salary (SAR)?',
    options: [
      { id: 'below-8000', text: 'Below 8,000' },
      { id: '8000-12000', text: '8,000 – 12,000' },
      { id: '12000-16000', text: '12,000 – 16,000' },
      { id: 'above-16000', text: 'Above 16,000' },
    ],
    required: true,
  },
  {
    id: 'saudi-resident',
    type: 'yes-no',
    question: 'Are you currently residing in Saudi Arabia?',
    options: yesNoOptions,
    required: true,
  },
];

export const APPLY_PREVIEW_ASSESSMENT: JobLinkedAssessment = {
  id: 'clinical-knowledge',
  title: 'Clinical Knowledge Assessment',
  category_id: 'nursing',
};
