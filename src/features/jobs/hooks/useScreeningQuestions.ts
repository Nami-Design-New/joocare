'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { SCREENING_QUESTION_TEMPLATES } from '../constants';
import type { ScreeningQuestion } from '../types/job-steps.types';
import type { JobFormData } from '../validation/job-post-schema';

const HIGHLIGHT_MS = 2500;
export const TEMPLATES_SECTION = 'templates';
export const CUSTOM_SECTION = 'custom';

// Step 2 screening questions: kept in the wizard form and sent with step 2.
export function useScreeningQuestions() {
  const t = useTranslations('companyPage.postJob.questions');
  const { setValue, watch } = useFormContext<JobFormData>();
  const questions = watch('screeningQuestions') ?? [];
  const [openSections, setOpenSections] = useState<string[]>([TEMPLATES_SECTION]);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);

  useEffect(() => {
    if (!highlightedId) return;
    const timer = window.setTimeout(() => setHighlightedId(null), HIGHLIGHT_MS);
    return () => window.clearTimeout(timer);
  }, [highlightedId]);

  const save = (next: ScreeningQuestion[]) =>
    setValue('screeningQuestions', next, { shouldDirty: true, shouldTouch: true });

  const add = (question: ScreeningQuestion) => {
    save([...questions, question]);
    setHighlightedId(question.id);
    // The custom list opens once a question exists (Figma 11531:118333).
    setOpenSections((current) =>
      current.includes(CUSTOM_SECTION) ? current : [...current, CUSTOM_SECTION],
    );
    toast.success(t('added-toast'));
  };

  const previewTemplate = SCREENING_QUESTION_TEMPLATES.find(
    (template) => template.id === previewTemplateId,
  );

  return {
    questions,
    openSections,
    setOpenSections,
    previewTemplate,
    previewTemplateId,
    setPreviewTemplateId,
    addedTemplateIds: questions.flatMap((question) => question.templateId ?? []),
    expandedId,
    toggleExpanded: (id: string) => setExpandedId((current) => (current === id ? null : id)),
    highlightedId,
    deleteId,
    setDeleteId,
    builderOpen,
    setBuilderOpen,
    addCustom: add,
    addTemplate: (answer: string, required: boolean) => {
      if (!previewTemplate) return;
      add({
        id: crypto.randomUUID(),
        source: 'template',
        templateId: previewTemplate.id,
        type: 'yes-no',
        question: previewTemplate.question,
        mark: 1,
        options: [
          { id: 'yes', text: t('yes') },
          { id: 'no', text: t('no') },
        ],
        correctOptionIds: [answer],
        required,
      });
      setPreviewTemplateId(null);
    },
    update: (question: ScreeningQuestion) => {
      save(questions.map((item) => (item.id === question.id ? question : item)));
      setExpandedId(null);
      toast.success(t('updated-toast'));
    },
    confirmDelete: () => {
      if (!deleteId) return;
      save(questions.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    },
  };
}

export type ScreeningQuestionsState = ReturnType<typeof useScreeningQuestions>;
