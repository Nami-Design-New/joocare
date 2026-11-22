'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import type {
  AssessmentNote,
  AssessmentNoteFormValues,
  AssessmentNotesState,
} from '../types/assessment-answers.types';
import { createAssessmentNoteSchema } from '../validation/assessment-note-schema';
import { useDeleteAssessmentResultNote } from './useDeleteAssessmentResultNote';
import { useSaveAssessmentResultNote } from './useSaveAssessmentResultNote';

// Notes of one assessment result, saved through the result notes API.
export function useAssessmentResultNotes(
  resultId: string,
  notes: AssessmentNote[],
): AssessmentNotesState {
  const t = useTranslations('companyPage.assessments.answers');
  const [editingId, setEditingId] = useState<string | null>(null);
  const saveMutation = useSaveAssessmentResultNote();
  const deleteMutation = useDeleteAssessmentResultNote();
  const schema = useMemo(
    () => createAssessmentNoteSchema(t('note-required')),
    [t],
  );
  const form = useForm<AssessmentNoteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { text: '' },
  });

  const cancelEdit = () => {
    setEditingId(null);
    form.reset({ text: '' });
  };

  const saveNote = form.handleSubmit(async ({ text }) => {
    if (saveMutation.isPending) return;
    try {
      await saveMutation.mutateAsync({ resultId, noteId: editingId, text });
      cancelEdit();
    } catch {
      // The mutation hook shows the error; keep the text so it can be retried.
    }
  });

  return {
    notes,
    form,
    editingId,
    isSaving: saveMutation.isPending,
    deletingId: deleteMutation.isPending
      ? (deleteMutation.variables ?? null)
      : null,
    saveNote,
    cancelEdit,
    editNote: (note) => {
      setEditingId(note.id);
      form.reset({ text: note.text });
      form.setFocus('text');
    },
    deleteNote: (id) => {
      if (deleteMutation.isPending) return;
      deleteMutation.mutate(id, {
        onSuccess: () => {
          if (editingId === id) cancelEdit();
        },
      });
    },
  };
}
