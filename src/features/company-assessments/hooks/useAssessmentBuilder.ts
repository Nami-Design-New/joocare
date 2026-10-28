'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { categorySeeds } from '../constants/assessment-data';
import {
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

export function useAssessmentBuilder({
  categoryId,
  category,
  initialDraft,
  onSubmit,
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
    defaultValues: initialDraft?.configuration ?? CONFIGURATION_DEFAULTS,
    shouldUnregister: false,
  });
  const [step, setStep] = useState(0);
  const [questions, setQuestions] = useState<BuilderQuestion[]>(
    initialDraft?.questions ?? [],
  );
  const [questionModal, setQuestionModal] = useState<{
    question: BuilderQuestion | null;
    readOnly?: boolean;
  } | null>(null);
  const [deletingQuestion, setDeletingQuestion] =
    useState<BuilderQuestion | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const totalScore = questions.reduce(
    (total, question) => total + Number(question.score),
    0,
  );
  const canReview = questions.length >= MIN_ASSESSMENT_QUESTIONS;

  function saveQuestion(values: QuestionFormValues) {
    const question = {
      ...values,
      attachment: values.attachmentEnabled ? values.attachment : null,
      id: questionModal?.question?.id ?? crypto.randomUUID(),
    };
    setQuestions((current) =>
      questionModal?.question
        ? current.map((item) => (item.id === question.id ? question : item))
        : [...current, question],
    );
    setQuestionModal(null);
  }

  async function next() {
    if (step === 0 && (await form.trigger())) setStep(1);
    else if (step === 1 && canReview) setStep(2);
  }

  async function submit() {
    if (pending || success || !canReview || !(await form.trigger())) return;
    setPending(true);
    setSubmitError('');
    try {
      await onSubmit?.({
        categoryId,
        configuration: form.getValues(),
        questions,
      });
      setSuccess(true);
    } catch {
      setSubmitError(t('save-error'));
      toast.error(t('save-error'));
    } finally {
      setPending(false);
    }
  }

  function reset() {
    form.reset(CONFIGURATION_DEFAULTS);
    setQuestions([]);
    setStep(0);
    setSuccess(false);
    setSubmitError('');
  }

  return {
    category:
      category ??
      categorySeeds.find(
        (item) => item.id === categoryId && item.source === 'company',
      ),
    form,
    step,
    questions,
    questionModal,
    setQuestionModal,
    deletingQuestion,
    setDeletingQuestion,
    success,
    setSuccess,
    pending,
    submitError,
    totalScore,
    canReview,
    saveQuestion,
    next,
    submit,
    reset,
    isDirty: !success && (form.formState.isDirty || questions.length > 0),
    previous: () => setStep((current) => Math.max(0, current - 1)),
    confirmDelete: () => {
      setQuestions((current) =>
        current.filter((question) => question.id !== deletingQuestion?.id),
      );
      setDeletingQuestion(null);
    },
  };
}
