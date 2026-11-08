'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import { CV_BUILDER_PREVIEW_SUMMARY, CV_BUILDER_ROUTES } from '../../constants';
import { CV_BUILDER_PREVIEW_VALUES } from '../../constants/cv-builder-preview-data';
import { useCvBuilderState } from '../../hooks/useCvBuilderState';
import type { CvBuilderState } from '../../types/cv-builder.types';
import CvViewModal from '../view/CvViewModal';
import CvBuilderHero from './CvBuilderHero';

type CvBuilderPageProps = {
  initialState: CvBuilderState;
};

// "Build Your Professional CV" landing page (design only, data stays on the page).
export default function CvBuilderPage({ initialState }: CvBuilderPageProps) {
  const t = useTranslations('candidatePage.buildCv.delete-modal');
  const router = useRouter();
  const cv = useCvBuilderState(initialState);

  return (
    <>
      <CvBuilderHero
        state={cv.state}
        summary={CV_BUILDER_PREVIEW_SUMMARY}
        onShowCv={cv.openShowCv}
        onDeleteDraft={cv.openDeleteDraft}
      />
      <DeleteModal
        open={cv.modal === 'delete-draft'}
        onOpenChange={(open) => !open && cv.closeModal()}
        title={t('title')}
        description={t('description')}
        confirmLabel={t('confirm')}
        cancelLabel={t('cancel')}
        onConfirm={cv.confirmDeleteDraft}
      />
      {cv.modal === 'show-cv' && (
        <CvViewModal
          values={CV_BUILDER_PREVIEW_VALUES}
          onOpenChange={(open) => !open && cv.closeModal()}
          onEdit={() => router.push(`${CV_BUILDER_ROUTES.create}?mode=edit`)}
        />
      )}
    </>
  );
}
