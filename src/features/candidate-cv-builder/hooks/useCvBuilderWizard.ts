'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from '@/i18n/navigation';
import { typedZodResolver } from '@/shared/lib/typed-zod-resolver';
import { CV_BUILDER_ROUTES, CV_BUILDER_STEPS } from '../constants';
import type {
  CvBuilderMode,
  CvBuilderRemoteData,
  CvBuilderValues,
} from '../types/cv-builder.types';
import { getEmptyCvValues } from '../utils/cv-builder-defaults';
import { useCvBuilderSchema } from './useCvBuilderSchema';
import { useSaveCvBuilderStepOne } from './useSaveCvBuilderStepOne';
import { useSaveCvBuilderStep } from './useSaveCvBuilderStep';
import { useDeleteCvDraft } from './useDeleteCvDraft';

const LAST_STEP = CV_BUILDER_STEPS.length - 1;

function getInitialValues(
  mode: CvBuilderMode,
  remoteCv: CvBuilderRemoteData | null,
): CvBuilderValues {
  if (mode !== 'new' && remoteCv?.values) return remoteCv.values;
  return getEmptyCvValues();
}

export type CvBuilderModal = 'saved' | 'delete-draft' | 'preview' | null;

// Wizard state: one form for all steps, the current step and the footer actions.
export function useCvBuilderWizard(
  mode: CvBuilderMode,
  remoteCv: CvBuilderRemoteData | null,
) {
  const router = useRouter();
  const schema = useCvBuilderSchema();
  const saveStepOne = useSaveCvBuilderStepOne();
  const saveStep = useSaveCvBuilderStep();
  const deleteDraft = useDeleteCvDraft();
  const form = useForm<CvBuilderValues>({
    resolver: typedZodResolver(schema),
    defaultValues: getInitialValues(mode, remoteCv),
    mode: 'onTouched',
  });
  const initialCompleted =
    mode === 'edit'
      ? CV_BUILDER_STEPS.length
      : Math.max((remoteCv?.currentStep ?? 1) - 1, 0);
  const [completedCount, setCompletedCount] = useState(initialCompleted);
  const [stepIndex, setStepIndex] = useState(
    mode === 'draft'
      ? Math.min(Math.max((remoteCv?.currentStep ?? 1) - 1, 0), LAST_STEP)
      : 0,
  );
  const [modal, setModal] = useState<CvBuilderModal>(null);
  const savedSteps = useRef<Map<number, string> | null>(null);

  if (savedSteps.current === null) {
    savedSteps.current = new Map(
      CV_BUILDER_STEPS.slice(0, initialCompleted).map((step, index) => [
        index,
        JSON.stringify(form.getValues(step.key)),
      ]),
    );
  }

  const goToStep = (index: number) => {
    setStepIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const next = async () => {
    const step = CV_BUILDER_STEPS[stepIndex];
    const currentValues = JSON.stringify(form.getValues(step.key));
    if (savedSteps.current?.get(stepIndex) === currentValues) {
      if (stepIndex === LAST_STEP) setModal('preview');
      else goToStep(stepIndex + 1);
      return;
    }

    // Array form: the error update then reaches every nested field of the step.
    const isValid = await form.trigger([step.key], {
      shouldFocus: true,
    });
    if (!isValid) return;

    try {
      if (stepIndex === 0) {
        await saveStepOne.mutateAsync({
          personal: form.getValues('personal'),
          photoChanged: form.getFieldState('personal.photo', form.formState)
            .isDirty,
        });
      } else {
        await saveStep.mutateAsync({
          step: stepIndex + 1,
          values: form.getValues(),
        });
      }
    } catch {
      return;
    }

    savedSteps.current?.set(stepIndex, currentValues);
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
    isSaving: saveStepOne.isPending || saveStep.isPending,
    isDeletingDraft: deleteDraft.isPending,
    prev: () => goToStep(Math.max(0, stepIndex - 1)),
    modal,
    setModal,
    closeModal: () => setModal(null),
    confirmDeleteDraft: () => {
      deleteDraft.mutate(undefined, {
        onSuccess: () => {
          setModal(null);
          router.push(CV_BUILDER_ROUTES.root);
        },
      });
    },
  };
}

export type CvBuilderWizard = ReturnType<typeof useCvBuilderWizard>;
