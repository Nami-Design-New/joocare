'use client';

import { useEffect, useState } from 'react';
import type { CvBuilderState } from '../types/cv-builder.types';
import { useDeleteCvDraft } from './useDeleteCvDraft';

type LandingModal = 'show-cv' | 'delete-draft' | null;

// Page-only state of the CV builder landing: current state + the CV view / delete-draft modals.
export function useCvBuilderState(initialState: CvBuilderState) {
  const [state, setState] = useState(initialState);
  const [modal, setModal] = useState<LandingModal>(null);
  const deleteDraft = useDeleteCvDraft();

  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  return {
    state,
    modal,
    closeModal: () => setModal(null),
    openShowCv: () => setModal('show-cv'),
    openDeleteDraft: () => setModal('delete-draft'),
    isDeletingDraft: deleteDraft.isPending,
    confirmDeleteDraft: () => {
      deleteDraft.mutate(undefined, {
        onSuccess: () => {
          setModal(null);
          setState('intro');
        },
      });
    },
  };
}
