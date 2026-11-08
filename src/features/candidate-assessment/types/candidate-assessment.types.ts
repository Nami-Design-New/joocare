// What the assessment link shows: the test itself, or why it can't be opened.
export type CandidateAssessmentState =
  | 'available'
  | 'expired'
  | 'taken'
  | 'unavailable';

export type CandidateAssessmentOption = {
  id: string;
  text: string;
};

// Assessments only use these 3 question types; no short-answer / text-input type.
export type CandidateAssessmentQuestionType = 'yes-no' | 'single' | 'multi';

export type CandidateAssessmentQuestion = {
  id: string;
  type: CandidateAssessmentQuestionType;
  text: string;
  options: CandidateAssessmentOption[];
};

export type CandidateAssessmentSubmission = {
  submittedAt: string;
  durationSeconds: number;
};

export type CandidateAssessment = {
  id: string;
  state: CandidateAssessmentState;
  title: string;
  sentBy: string;
  hiringTeamEmail: string;
  scope: string;
  timeLimitMinutes: number;
  maxAttempts: number;
  passScore: number;
  /** ISO dates: the link is valid for 72 hours after it is emailed. */
  sentAt: string;
  expiresAt: string;
  questions: CandidateAssessmentQuestion[];
  submission?: CandidateAssessmentSubmission;
};

/** Picked option ids per question id (single/yes-no hold at most one). */
export type CandidateAssessmentAnswers = Record<string, string[]>;
