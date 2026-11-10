import type {
  AssessmentAnswerQuestion,
  AssessmentNote,
} from '../types/assessment-answers.types';
import { ASSESSMENT_ASSETS } from './assessment-invitations';

export const ANSWER_REVIEW_PAGE_SIZE = 6;

export const assessmentAnswerAttemptSeed = {
  sentAt: '2026-09-10T09:00:00Z',
  startedAt: '2026-09-11T10:12:00Z',
  finishedAt: '2026-09-11T10:34:14Z',
  durationSeconds: 1334,
};

// Raw preview content, replaced by the candidate answers API when available.
const questionExamples: Omit<AssessmentAnswerQuestion, 'id' | 'number'>[] = [
  {
    text: 'Which of the following is the most appropriate initial treatment for a patient presenting with acute myocardial infarction?',
    multiple: false,
    options: [
      { id: 'a', text: 'Aspirin & immediate ECG evaluation' },
      { id: 'b', text: 'Oral antibiotics and bed rest' },
      { id: 'c', text: 'Intravenous fluids only' },
      { id: 'd', text: 'Antihistamines and observation' },
    ],
    correctOptionIds: ['a'],
    selectedOptionIds: ['a'],
    points: 10,
    maxPoints: 10,
  },
  {
    text: 'What is the primary mechanism of action of ACE inhibitors in treating hypertension?',
    multiple: false,
    options: [
      { id: 'a', text: 'Blocking calcium channels in vascular smooth muscle' },
      { id: 'b', text: 'Stimulating beta-adrenergic receptors in the heart' },
      {
        id: 'c',
        text: 'Inhibition of Angiotensin-Converting Enzyme to promote vasodilation',
      },
      { id: 'd', text: 'Enhancing renal sodium reabsorption' },
    ],
    correctOptionIds: ['c'],
    selectedOptionIds: ['b'],
    points: 0,
    maxPoints: 10,
  },
  {
    text: 'Hypertension is defined as blood pressure consistently above 140/90 mmHg.',
    multiple: false,
    options: [
      { id: 'a', text: 'Yes' },
      { id: 'b', text: 'No' },
    ],
    correctOptionIds: ['a'],
    selectedOptionIds: ['a'],
    points: 10,
    maxPoints: 10,
    initiallyCollapsed: true,
  },
  {
    text: 'Which of the following are part of the initial Basic Life Support (BLS) assessment? (Select all that apply)',
    multiple: true,
    options: [
      { id: 'a', text: 'Make sure the scene is safe' },
      { id: 'b', text: 'Check the patient for responsiveness and breathing' },
      { id: 'c', text: 'Give rescue breaths before checking for a response' },
      {
        id: 'd',
        text: 'Call for help and activate the emergency response system',
      },
    ],
    correctOptionIds: ['a', 'b', 'd'],
    selectedOptionIds: ['a', 'b', 'd'],
    points: 10,
    maxPoints: 10,
    optional: true,
  },
  {
    text: 'Does the ECG strip above show a normal sinus rhythm?',
    multiple: false,
    options: [
      { id: 'a', text: 'Yes' },
      { id: 'b', text: 'No' },
    ],
    correctOptionIds: ['a'],
    selectedOptionIds: ['b'],
    points: 0,
    maxPoints: 10,
    image: {
      src: `${ASSESSMENT_ASSETS}/ecg-strip.svg`,
      width: 384,
      height: 216,
      description: 'ECG strip, Lead II, 25 mm/s',
    },
  },
  {
    text: 'Which electrolyte imbalance is most commonly associated with peaked T-waves on an ECG?',
    multiple: false,
    options: [
      { id: 'a', text: 'Hypokalemia' },
      { id: 'b', text: 'Hyperkalemia' },
      { id: 'c', text: 'Hyponatremia' },
      { id: 'd', text: 'Hypocalcemia' },
    ],
    correctOptionIds: ['b'],
    selectedOptionIds: [],
    points: 0,
    maxPoints: 10,
    optional: true,
  },
];

// Repeat preview examples for pagination; API responses will supply every question.
const previewQuestionOrder = [
  0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 1, 4, 0,
];

export const assessmentAnswerQuestions: AssessmentAnswerQuestion[] =
  previewQuestionOrder.map((exampleIndex, index) => ({
    ...questionExamples[exampleIndex],
    id: `answer-question-${index + 1}`,
    number: index + 1,
  }));

export const assessmentNoteSeeds: AssessmentNote[] = [
  {
    id: 'mona-note',
    author: 'Mona Al-Harbi',
    initials: 'MA',
    role: 'Recruiter',
    createdAt: '2026-09-12T11:05:00Z',
    edited: true,
    text: 'Strong on cardiac pharmacology but missed the dyspnea work-up question. Suggest a technical interview focused on emergency diagnostics before rejecting.',
  },
  {
    id: 'khalid-note',
    author: 'Khalid Al-Saeed',
    initials: 'KS',
    role: 'Admin',
    createdAt: '2026-09-11T16:20:00Z',
    text: 'Finished in 22 minutes – well under the time limit. Re-check Q5 with the clinical lead.',
  },
];

export const ASSESSMENT_NOTE_AUTHOR = {
  author: 'Mona Al-Harbi',
  initials: 'MA',
  role: 'Recruiter',
};
