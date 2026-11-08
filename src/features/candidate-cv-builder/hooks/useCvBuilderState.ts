'use client';

import { useState } from 'react';
import type { CvBuilderState } from '../types/cv-builder.types';

// Page-only state of the CV builder landing: current state + delete-draft confirmation.
export function useCvBuilderState(initialState: CvBuilderState) {
  const [state, setState] = useState(initialState);
  const [deleteDraftOpen, setDeleteDraftOpen] = useState(false);

  const confirmDeleteDraft = () => {
    setDeleteDraftOpen(false);
    setState('intro');
  };

  return {
    state,
    deleteDraftOpen,
    setDeleteDraftOpen,
    openDeleteDraft: () => setDeleteDraftOpen(true),
    confirmDeleteDraft,
  };
}
