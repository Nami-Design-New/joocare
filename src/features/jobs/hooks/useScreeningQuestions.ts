'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { MAX_SCREENING_QUESTIONS } from '../constants';
import type { ScreeningQuestion } from '../types/job-steps.types';
import type { JobFormData } from '../validation/job-post-schema';
import { useGetQuestionTemplate } from './useGetQuestionTemplate';
import { useGetQuestionTemplateHints } from './useGetQuestionTemplateHints';

const HIGHLIGHT_MS = 2500;
export const TEMPLATES_SECTION = 'templates';
export const CUSTOM_SECTION = 'custom';

// Step 2 screening questions: kept in the wizard form and sent with step 2.
export function useScreeningQuestions() {
  const t = useTranslations('companyPage.postJob.questions');
  const { setValue, watch, getValues } = useFormContext<JobFormData>();
  const questions = watch('screeningQuestions') ?? [];
  const isAtLimit = questions.length >= MAX_SCREENING_QUESTIONS;
  // Saved questions may arrive after this section mounts. Keep the default
  // responsive to hydration until the user chooses which sections to open.
  const [selectedSections, setOpenSections] = useState<string[] | null>(null);
  const openSections =
    selectedSections ??
    (questions.length
      ? [TEMPLATES_SECTION, CUSTOM_SECTION]
      : [TEMPLATES_SECTION]);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(
    null,
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);
  // Editing a custom question always opens the modal (pencil button); the
  // card's own expand/collapse only ever shows a read-only preview.
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!highlightedId) return;
    const timer = window.setTimeout(() => setHighlightedId(null), HIGHLIGHT_MS);
    return () => window.clearTimeout(timer);
  }, [highlightedId]);

  const save = (next: ScreeningQuestion[]) =>
    setValue('screeningQuestions', next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

  const add = (question: ScreeningQuestion) => {
    const currentQuestions = getValues('screeningQuestions') ?? [];
    if (currentQuestions.length >= MAX_SCREENING_QUESTIONS) {
      toast.error(t('limit-reached', { max: MAX_SCREENING_QUESTIONS }));
      return;
    }
    save([...currentQuestions, question]);
    setHighlightedId(question.id);
    // The custom list opens once a question exists (Figma 11531:118333).
    setOpenSections(
      openSections.includes(CUSTOM_SECTION)
        ? openSections
        : [...openSections, CUSTOM_SECTION],
    );
    toast.success(t('added-toast'));
  };

  const hints = useGetQuestionTemplateHints();
  const previewTemplate = useGetQuestionTemplate(previewTemplateId);

  return {
    questions,
    isAtLimit,
    openSections,
    setOpenSections,
    hints,
    previewTemplate,
    previewTemplateId,
    setPreviewTemplateId,
    addedTemplateIds: questions.flatMap(
      (question) => question.templateId ?? [],
    ),
    expandedId,
    toggleExpanded: (id: string) =>
      setExpandedId((current) => (current === id ? null : id)),
    highlightedId,
    deleteId,
    setDeleteId,
    builderOpen,
    setBuilderOpen,
    editingId,
    editingQuestion:
      questions.find((question) => question.id === editingId) ?? null,
    openEdit: (id: string) => setEditingId(id),
    closeEdit: () => setEditingId(null),
    addCustom: add,
    addTemplate: (answer: string, required: boolean) => {
      const template = previewTemplate.data;
      if (!template) return;
      add({
        id: crypto.randomUUID(),
        source: 'template',
        templateId: String(template.id),
        type: 'yes-no',
        question: template.question,
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
      save(
        questions.map((item) => (item.id === question.id ? question : item)),
      );
      setEditingId(null);
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
