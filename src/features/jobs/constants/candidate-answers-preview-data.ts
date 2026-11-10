import type { CandidateScreeningAnswers } from '../types/candidate-answers.types';

// Design preview data until the applications API returns screening answers (mock data, not translated).
const yesNoOptions = [
  { id: 'yes', text: 'Yes' },
  { id: 'no', text: 'No' },
];

export const CANDIDATE_ANSWERS_PREVIEW: CandidateScreeningAnswers = {
  jobTitle: 'Staff Nurse – ICU',
  questions: [
    {
      id: 'available-immediately',
      type: 'yes-no',
      question: 'Are you available to join immediately?',
      required: true,
      options: yesNoOptions,
      correctOptionIds: ['yes'],
      selectedOptionIds: ['yes'],
    },
    {
      id: 'notice-period',
      type: 'single',
      question: 'What is your notice period?',
      required: true,
      options: [
        { id: 'immediately', text: 'Immediately available' },
        { id: '1-month', text: '1 month' },
        { id: '2-months', text: '2 months' },
        { id: '3-months', text: '3 months or more' },
      ],
      correctOptionIds: ['immediately'],
      selectedOptionIds: ['1-month'],
    },
    {
      id: 'clinical-areas',
      type: 'multi',
      question: 'Which clinical areas do you have hands-on experience in?',
      required: false,
      options: [
        { id: 'icu', text: 'Intensive Care Unit (ICU)' },
        { id: 'emergency', text: 'Emergency Department' },
        { id: 'paediatrics', text: 'Paediatrics' },
        { id: 'cardiology', text: 'Cardiology / CCU' },
      ],
      correctOptionIds: ['icu', 'emergency'],
      selectedOptionIds: ['icu', 'emergency'],
    },
    {
      id: 'bls-acls',
      type: 'yes-no',
      question: 'Do you hold a valid BLS / ACLS certification?',
      required: true,
      options: yesNoOptions,
      correctOptionIds: ['yes'],
      selectedOptionIds: ['yes'],
    },
    {
      id: 'nursing-experience',
      type: 'single',
      question: 'How many years of nursing experience do you have?',
      required: true,
      options: [
        { id: 'under-2', text: 'Less than 2 years' },
        { id: '2-5', text: '2 – 5 years' },
        { id: '5-10', text: '5 – 10 years' },
        { id: 'over-10', text: 'More than 10 years' },
      ],
      correctOptionIds: ['2-5'],
      selectedOptionIds: ['2-5'],
    },
    {
      id: 'night-shifts',
      type: 'yes-no',
      question: 'Are you willing to work rotating night shifts?',
      required: false,
      options: yesNoOptions,
      correctOptionIds: ['yes'],
      selectedOptionIds: [],
    },
  ],
};
