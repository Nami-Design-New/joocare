import type { AssessmentDetail } from '../types/assessment.types';

const questionExamples = [
  'Which of the following is the most appropriate initial treatment for a patient presenting with acute chest pain?',
  'A patient presents with sudden-onset dyspnea. Which diagnostic test should be ordered first?',
  'What is the primary mechanism of action of ACE inhibitors in treating hypertension?',
  'Identify the correct sequence for Basic Life Support (BLS).',
  'Hypertension is defined as blood pressure consistently above 140/90 mmHg.',
  'Which finding is most consistent with an acute ischemic stroke?',
  'What is the recommended first-line medication for anaphylaxis?',
  'Which laboratory result requires immediate clinical intervention?',
  'When should a patient with suspected sepsis receive the first dose of antibiotics?',
  'Which assessment best evaluates a patient’s level of consciousness?',
];

export const assessmentDetailSeeds: AssessmentDetail[] = [
  {
    assessmentId: 'company-0-1',
    summaryTitle: 'Medical Knowledge Assessment',
    summary:
      'Comprehensive assessment covering core medical knowledge areas including pharmacology, pathophysiology, and clinical reasoning.',
    totalQuestions: 24,
    timeLimitMinutes: 25,
    maxAttempts: 1,
    allowedQuestionTypes: [
      { label: 'Single Select', count: 8 },
      { label: 'Yes / No', count: 12 },
      { label: 'Multiple Choice', count: 4 },
    ],
    pausedCandidateCount: 37,
    questions: Array.from({ length: 57 }, (_, index) => ({
      id: `question-${index + 1}`,
      questionText: questionExamples[index % questionExamples.length],
      type: index % 5 === 4 ? 'Yes / No' : 'Single Select',
      score: 20,
    })),
    creator: {
      name: 'Dr. Amelia Chen',
      role: 'Clinical Recruitment Lead',
      initials: 'AC',
    },
  },
];
