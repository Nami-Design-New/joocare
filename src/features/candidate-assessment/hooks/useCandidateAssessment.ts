import { useState } from 'react';
import type {
  CandidateAssessment,
  CandidateAssessmentAnswers,
  CandidateAssessmentSubmission,
} from '../types/candidate-assessment.types';
import { useCountdown } from './useCountdown';

const MINUTE_MS = 60 * 1000;

// Taking an assessment: intro → one locked question at a time → submit (also when time runs out).
// Design only: answers stay on the page until the assessment API is ready.
export function useCandidateAssessment(assessment: CandidateAssessment) {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<CandidateAssessmentAnswers>({});
  const [submission, setSubmission] =
    useState<CandidateAssessmentSubmission | null>(
      assessment.submission ?? null,
    );
  const [isSubmittedModalOpen, setSubmittedModalOpen] = useState(false);

  const total = assessment.questions.length;
  const question = assessment.questions[index];
  const isLastQuestion = index === total - 1;
  // Ends at the time limit or when the 72-hour link expires, whichever comes first.
  const deadline =
    startedAt === null || submission
      ? null
      : Math.min(
          startedAt + assessment.timeLimitMinutes * MINUTE_MS,
          new Date(assessment.expiresAt).getTime(),
        );

  const submit = () => {
    const now = Date.now();
    setSubmission({
      submittedAt: new Date(now).toISOString(),
      durationSeconds: Math.round((now - (startedAt ?? now)) / 1000),
    });
    setSubmittedModalOpen(true);
  };

  const remainingSeconds = useCountdown(deadline, submit);

  const start = () => setStartedAt(Date.now());

  const selectAnswer = (optionId: string) => {
    if (!question) return;
    setAnswers((current) => ({ ...current, [question.id]: optionId }));
  };

  // "No going back": the answer is locked once the candidate moves on.
  const next = () => {
    if (!question || !answers[question.id]) return;
    if (isLastQuestion) submit();
    else setIndex((current) => current + 1);
  };

  return {
    hasStarted: startedAt !== null,
    submission,
    question,
    questionNumber: index + 1,
    total,
    // Answered questions out of all, shown as "% Complete".
    progress: total
      ? Math.round((Object.keys(answers).length / total) * 100)
      : 0,
    selectedOptionId: question ? answers[question.id] : undefined,
    isLastQuestion,
    remainingSeconds,
    isSubmittedModalOpen,
    setSubmittedModalOpen,
    start,
    selectAnswer,
    next,
  };
}
