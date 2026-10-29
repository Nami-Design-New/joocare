'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  ASSESSMENT_NOTE_AUTHOR,
  assessmentNoteSeeds,
} from '../constants/assessment-answers';
import type {
  AssessmentNote,
  AssessmentNoteFormValues,
} from '../types/assessment-answers.types';
import { createAssessmentNoteSchema } from '../validation/assessment-note-schema';

export function useAssessmentNotes() {
  const t = useTranslations('companyPage.assessments.answers');
  const [notes, setNotes] = useState<AssessmentNote[]>(assessmentNoteSeeds);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const saveNote = form.handleSubmit(({ text }) => {
    if (editingId) {
      setNotes((current) =>
        current.map((note) =>
          note.id === editingId ? { ...note, text, edited: true } : note,
        ),
      );
    } else {
      setNotes((current) => [
        {
          ...ASSESSMENT_NOTE_AUTHOR,
          id: crypto.randomUUID(),
          text,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
    }
    cancelEdit();
  });

  return {
    notes,
    form,
    editingId,
    saveNote,
    cancelEdit,
    editNote: (note: AssessmentNote) => {
      setEditingId(note.id);
      form.reset({ text: note.text });
      form.setFocus('text');
    },
    deleteNote: (id: string) => {
      setNotes((current) => current.filter((note) => note.id !== id));
      if (editingId === id) cancelEdit();
    },
  };
}
