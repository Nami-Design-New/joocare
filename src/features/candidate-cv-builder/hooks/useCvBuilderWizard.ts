'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from '@/i18n/navigation';
import { typedZodResolver } from '@/shared/lib/typed-zod-resolver';
import {
  CV_BUILDER_PREVIEW_SUMMARY,
  CV_BUILDER_ROUTES,
  CV_BUILDER_STEPS,
} from '../constants';
import {
  CV_BUILDER_PREVIEW_VALUES,
  getDraftCvValues,
} from '../constants/cv-builder-preview-data';
import type { CvBuilderMode, CvBuilderValues } from '../types/cv-builder.types';
import { getEmptyCvValues } from '../utils/cv-builder-defaults';
import { useCvBuilderSchema } from './useCvBuilderSchema';

const LAST_STEP = CV_BUILDER_STEPS.length - 1;

function getInitialValues(mode: CvBuilderMode): CvBuilderValues {
  if (mode === 'edit') return CV_BUILDER_PREVIEW_VALUES;
  if (mode === 'draft') return getDraftCvValues();
  return getEmptyCvValues();
}

// Steps already done when the wizard opens (a draft resumes after its saved steps).
function getCompletedCount(mode: CvBuilderMode) {
  if (mode === 'edit') return CV_BUILDER_STEPS.length;
  if (mode === 'draft') return CV_BUILDER_PREVIEW_SUMMARY.completedSteps;
  return 0;
}

export type CvBuilderModal = 'saved' | 'delete-draft' | 'preview' | null;

// Wizard state: one form for all steps, the current step and the footer actions.
// Design only: values stay on this page until the CV builder API is ready.
export function useCvBuilderWizard(mode: CvBuilderMode) {
  const router = useRouter();
  const schema = useCvBuilderSchema();
  const form = useForm<CvBuilderValues>({
    resolver: typedZodResolver(schema),
    defaultValues: getInitialValues(mode),
    mode: 'onTouched',
  });
  const initialCompleted = getCompletedCount(mode);
  const [completedCount, setCompletedCount] = useState(initialCompleted);
  const [stepIndex, setStepIndex] = useState(
    mode === 'draft' ? initialCompleted : 0,
  );
  const [modal, setModal] = useState<CvBuilderModal>(null);

  const goToStep = (index: number) => {
    setStepIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const next = async () => {
    // Array form: the error update then reaches every nested field of the step.
    const isValid = await form.trigger([CV_BUILDER_STEPS[stepIndex].key], {
      shouldFocus: true,
    });
    if (!isValid) return;

    setCompletedCount((count) => Math.max(count, stepIndex + 1));
    if (stepIndex === LAST_STEP) setModal('preview');
    else goToStep(stepIndex + 1);
  };

  return {
    form,
    mode,
    stepIndex,
    isFirstStep: stepIndex === 0,
    isLastStep: stepIndex === LAST_STEP,
    /** Done steps and the current one can be opened from the stepper. */
    canOpenStep: (index: number) => index <= completedCount,
    isStepCompleted: (index: number) => index < completedCount,
    goToStep,
    next,
    prev: () => goToStep(Math.max(0, stepIndex - 1)),
    modal,
    setModal,
    closeModal: () => setModal(null),
    confirmDeleteDraft: () => {
      setModal(null);
      router.push(CV_BUILDER_ROUTES.root);
    },
  };
}

export type CvBuilderWizard = ReturnType<typeof useCvBuilderWizard>;
