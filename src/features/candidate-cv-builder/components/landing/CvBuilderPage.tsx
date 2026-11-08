'use client';

import { useTranslations } from 'next-intl';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import { CV_BUILDER_PREVIEW_SUMMARY } from '../../constants';
import { useCvBuilderState } from '../../hooks/useCvBuilderState';
import type { CvBuilderState } from '../../types/cv-builder.types';
import CvBuilderHero from './CvBuilderHero';

type CvBuilderPageProps = {
  initialState: CvBuilderState;
};

// "Build Your Professional CV" landing page (design only, data stays on the page).
export default function CvBuilderPage({ initialState }: CvBuilderPageProps) {
  const t = useTranslations('candidatePage.buildCv.delete-modal');
  const cv = useCvBuilderState(initialState);

  return (
    <>
      <CvBuilderHero
        state={cv.state}
        summary={CV_BUILDER_PREVIEW_SUMMARY}
        onDeleteDraft={cv.openDeleteDraft}
      />
      <DeleteModal
        open={cv.deleteDraftOpen}
        onOpenChange={cv.setDeleteDraftOpen}
        title={t('title')}
        description={t('description')}
        confirmLabel={t('confirm')}
        cancelLabel={t('cancel')}
        onConfirm={cv.confirmDeleteDraft}
      />
    </>
  );
}
