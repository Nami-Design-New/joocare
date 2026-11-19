'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { CV_BUILDER_ROUTES, CV_BUILDER_STEPS } from '../../constants';
import { useGetCvBuilder } from '../../hooks/useGetCvBuilder';
import { useCvBuilderState } from '../../hooks/useCvBuilderState';
import type { CvBuilderState } from '../../types/cv-builder.types';
import CvViewModal from '../view/CvViewModal';
import CvBuilderHero from './CvBuilderHero';

type CvBuilderPageProps = {
  initialState?: CvBuilderState;
};

// "Build Your Professional CV" landing page.
export default function CvBuilderPage({
  initialState = 'intro',
}: CvBuilderPageProps) {
  const t = useTranslations('candidatePage.buildCv');
  const router = useRouter();
  const remoteCv = useGetCvBuilder();
  const cv = useCvBuilderState(remoteCv.data?.state ?? initialState);

  if (remoteCv.isLoading) {
    return <Skeleton className="h-80 w-full rounded-2xl" />;
  }

  if (remoteCv.isError) {
    return (
      <section className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-2xl bg-card p-6 text-center shadow-card">
        <p className="text-sm text-destructive">{t('load-error')}</p>
        <Button type="button" onClick={() => void remoteCv.refetch()}>
          {t('retry')}
        </Button>
      </section>
    );
  }

  const data = remoteCv.data;
  const summary = data?.summary ?? {
    lastSavedAt: '',
    completedSteps: 0,
    totalSteps: CV_BUILDER_STEPS.length,
  };

  return (
    <>
      <CvBuilderHero
        state={cv.state}
        summary={summary}
        onShowCv={cv.openShowCv}
        onDeleteDraft={cv.openDeleteDraft}
      />
      <DeleteModal
        open={cv.modal === 'delete-draft'}
        onOpenChange={(open) => !open && cv.closeModal()}
        title={t('delete-modal.title')}
        description={t('delete-modal.description')}
        confirmLabel={t('delete-modal.confirm')}
        cancelLabel={t('delete-modal.cancel')}
        isLoading={cv.isDeletingDraft}
        onConfirm={cv.confirmDeleteDraft}
      />
      {cv.modal === 'show-cv' && data?.values && (
        <CvViewModal
          values={data.values}
          onOpenChange={(open) => !open && cv.closeModal()}
          onEdit={() => router.push(`${CV_BUILDER_ROUTES.create}?mode=edit`)}
        />
      )}
    </>
  );
}
