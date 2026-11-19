'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { getHttpErrorMessage } from '@/shared/lib/http-error';
import type { AssessmentAttempt } from '../types/assessment-api.types';
import { useStartCandidateAssessment } from './useStartCandidateAssessment';
import { useAnswerCandidateAssessment } from './useAnswerCandidateAssessment';

export function useCandidateAssessment(id: string) {
  const t = useTranslations('candidatePage.assessment.api');
  const startMutation = useStartCandidateAssessment(id);
  const answerMutation = useAnswerCandidateAssessment(id);
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [hasError, setHasError] = useState(false);
  const [submittedModalOpen, setSubmittedModalOpen] = useState(false);
  const locked = useRef(false);
  const question = attempt?.next_question;
  const start = async () => {
    if (locked.current) return;
    locked.current = true;
    try {
      const result = await startMutation.mutateAsync();
      setAttempt(result);
      if (result.next_question?.id !== question?.id) setSelectedIds([]);
      setHasError(false);
    } catch (error) {
      setHasError(true);
      toast.error(getHttpErrorMessage(error) || t('request-error'));
    } finally {
      locked.current = false;
    }
  };
  const next = async () => {
    if (locked.current || !question || !selectedIds.length) return;
    locked.current = true;
    try {
      const result = await answerMutation.mutateAsync({
        question_id: question.id,
        answer_ids: selectedIds,
      });
      setAttempt(result);
      setSelectedIds([]);
      setHasError(false);
      if (result.is_submitted) setSubmittedModalOpen(true);
    } catch (error) {
      setHasError(true);
      toast.error(getHttpErrorMessage(error) || t('request-error'));
    } finally {
      locked.current = false;
    }
  };
  const toggleOption = (value: string) => {
    if (locked.current || !question) return;
    const optionId = Number(value);
    if (!question.answers.some((answer) => answer.id === optionId)) return;
    setSelectedIds((current) =>
      question.type !== 'multi_choice'
        ? [optionId]
        : current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId],
    );
  };
  return {
    attempt,
    question,
    selectedIds,
    start,
    next,
    toggleOption,
    hasError,
    submittedModalOpen,
    setSubmittedModalOpen,
    isPending: startMutation.isPending || answerMutation.isPending,
  };
}
