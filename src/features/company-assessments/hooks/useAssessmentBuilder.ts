'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  ASSESSMENT_QUESTIONS_PAGE_SIZE,
  CONFIGURATION_DEFAULTS,
  MIN_ASSESSMENT_QUESTIONS,
} from '../constants/assessment-builder';
import { createAssessmentConfigurationSchema } from '../validation/assessment-builder-schema';
import type {
  AssessmentBuilderProps,
  AssessmentConfiguration,
  BuilderQuestion,
  QuestionFormValues,
} from '../types/assessment-builder.types';
import { useDeleteAssessmentQuestion } from './useDeleteAssessmentQuestion';
import { useGetAssessment } from './useGetAssessment';
import { useGetAssessmentQuestions } from './useGetAssessmentQuestions';
import { useSaveAssessment } from './useSaveAssessment';
import { useSaveAssessmentQuestion } from './useSaveAssessmentQuestion';

// Updates `?assessmentId=` without a navigation, so the builder keeps its state.
function syncAssessmentIdInUrl(assessmentId: string | null) {
  const url = new URL(window.location.href);
  if (assessmentId) url.searchParams.set('assessmentId', assessmentId);
  else url.searchParams.delete('assessmentId');
  window.history.replaceState(null, '', url);
}

function getLastPage(count: number) {
  return Math.max(1, Math.ceil(count / ASSESSMENT_QUESTIONS_PAGE_SIZE));
}

// Each step saves to the API: step 1 stores the assessment, step 2 stores
// every question as it is added, and step 3 reviews the saved assessment.
export function useAssessmentBuilder({
  categoryId,
  initialAssessment,
}: AssessmentBuilderProps) {
  const t = useTranslations('companyPage.assessments.builder');
  const schema = useMemo(
    () =>
      createAssessmentConfigurationSchema({
        required: t('validation.required'),
        percentage: t('validation.percentage'),
        duration: t('validation.duration'),
        options: t('validation.options'),
        answer: t('validation.answer'),
        attachment: t('validation.attachment'),
      }),
    [t],
  );
  const form = useForm<AssessmentConfiguration>({
    resolver: zodResolver(schema),
    defaultValues: initialAssessment?.configuration ?? CONFIGURATION_DEFAULTS,
    shouldUnregister: false,
  });
  const [step, setStep] = useState(0);
  const [assessmentId, setAssessmentId] = useState<string | null>(
    initialAssessment?.id ?? null,
  );
  const [questionsPage, setQuestionsPage] = useState(1);
  const [questionModal, setQuestionModal] = useState<{
    question: BuilderQuestion | null;
  } | null>(null);
  const [previewQuestionId, setPreviewQuestionId] = useState<string | null>(
    null,
  );
  const [deletingQuestion, setDeletingQuestion] =
    useState<BuilderQuestion | null>(null);
  const [success, setSuccess] = useState(false);

  const saveAssessment = useSaveAssessment();
  const saveQuestionMutation = useSaveAssessmentQuestion();
  const deleteQuestion = useDeleteAssessmentQuestion();
  const assessment = useGetAssessment(assessmentId);
  const questionCount = assessment.data?.questionCount ?? 0;
  const currentQuestionsPage = Math.min(
    questionsPage,
    getLastPage(questionCount),
  );
  const questions = useGetAssessmentQuestions(
    assessmentId,
    currentQuestionsPage,
  );
  const canReview = questionCount >= MIN_ASSESSMENT_QUESTIONS;

  async function saveConfiguration() {
    const configuration = form.getValues();
    if (assessmentId && !form.formState.isDirty) return true;
    try {
      const savedId = await saveAssessment.mutateAsync({
        assessmentId,
        categoryId,
        configuration,
      });
      form.reset(configuration);
      if (!assessmentId) {
        setAssessmentId(savedId);
        syncAssessmentIdInUrl(savedId);
      }
      return true;
    } catch {
      return false;
    }
  }

  async function next() {
    if (step === 0) {
      if ((await form.trigger()) && (await saveConfiguration())) setStep(1);
      return;
    }
    if (step === 1 && canReview) setStep(2);
  }

  async function saveQuestion(values: QuestionFormValues) {
    if (!assessmentId) return;
    const original = questionModal?.question ?? null;
    const originalFileId = original?.existingAttachment?.id;
    const keepsOriginalFile =
      values.attachmentEnabled &&
      Boolean(values.existingAttachment) &&
      !values.attachment;
    try {
      await saveQuestionMutation.mutateAsync({
        questionId: original?.id ?? null,
        assessmentId,
        values,
        deleteFileIds:
          originalFileId && !keepsOriginalFile ? [originalFileId] : [],
      });
      setQuestionModal(null);
    } catch {
      // The mutation hook shows the error toast; keep the modal open to retry.
    }
  }

  async function confirmDelete() {
    if (!deletingQuestion) return;
    try {
      await deleteQuestion.mutateAsync(deletingQuestion.id);
      setDeletingQuestion(null);
    } catch {
      // The mutation hook shows the error toast; keep the dialog open to retry.
    }
  }

  function reset() {
    form.reset(CONFIGURATION_DEFAULTS);
    setAssessmentId(null);
    setStep(0);
    setQuestionsPage(1);
    setSuccess(false);
    syncAssessmentIdInUrl(null);
  }

  return {
    form,
    step,
    assessment,
    questions,
    questionsPage: currentQuestionsPage,
    setQuestionsPage,
    questionCount,
    totalScore: assessment.data?.totalScore ?? 0,
    canReview,
    isSavingConfiguration: saveAssessment.isPending,
    questionModal,
    setQuestionModal,
    saveQuestion,
    previewQuestionId,
    setPreviewQuestionId,
    deletingQuestion,
    setDeletingQuestion,
    isDeletingQuestion: deleteQuestion.isPending,
    confirmDelete,
    success,
    submit: () => {
      if (canReview) setSuccess(true);
    },
    reset,
    next,
    previous: () => setStep((current) => Math.max(0, current - 1)),
    isDirty: !success && form.formState.isDirty,
  };
}
