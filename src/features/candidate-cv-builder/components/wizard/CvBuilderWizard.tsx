'use client';

import { useTranslations } from 'next-intl';
import { FormProvider } from 'react-hook-form';
import { useRouter } from '@/i18n/navigation';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { CV_BUILDER_ROUTES, CV_BUILDER_STEPS } from '../../constants';
import { useGetCvBuilder } from '../../hooks/useGetCvBuilder';
import { useCvBuilderWizard } from '../../hooks/useCvBuilderWizard';
import type {
  CvBuilderMode,
  CvBuilderRemoteData,
} from '../../types/cv-builder.types';
import CvViewModal from '../view/CvViewModal';
import CvBuilderFooter from './CvBuilderFooter';
import CvBuilderStepper from './CvBuilderStepper';
import CvStepContent from './CvStepContent';

type CvBuilderWizardProps = {
  mode: CvBuilderMode;
};

// "Create CV" wizard: vertical stepper, current step and footer actions.
export default function CvBuilderWizard({ mode }: CvBuilderWizardProps) {
  const t = useTranslations('candidatePage.buildCv');
  const remoteCv = useGetCvBuilder();

  if (remoteCv.isLoading) {
    return <Skeleton className="h-160 w-full rounded-2xl" />;
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

  const resolvedMode =
    mode === 'new' && remoteCv.data?.values
      ? remoteCv.data.state === 'exists'
        ? 'edit'
        : 'draft'
      : mode;

  return (
    <CvBuilderWizardForm
      key={resolvedMode}
      mode={resolvedMode}
      remoteCv={remoteCv.data ?? null}
    />
  );
}

type CvBuilderWizardFormProps = {
  mode: CvBuilderMode;
  remoteCv: CvBuilderRemoteData | null;
};

function CvBuilderWizardForm({ mode, remoteCv }: CvBuilderWizardFormProps) {
  const t = useTranslations('candidatePage.buildCv');
  const router = useRouter();
  const wizard = useCvBuilderWizard(mode, remoteCv);
  const step = CV_BUILDER_STEPS[wizard.stepIndex];

  return (
    <FormProvider {...wizard.form}>
      <section className="grid grid-cols-1 gap-6 rounded-2xl bg-card p-2 shadow-card md:p-4 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
        <CvBuilderStepper wizard={wizard} />

        <form
          noValidate
          aria-label={t(`steps.${step.label}`)}
          onSubmit={(event) => {
            event.preventDefault();
            void wizard.next();
          }}
          className="flex min-w-0 flex-col gap-8 sm:gap-15"
        >
          <CvStepContent step={step.key} />
          <CvBuilderFooter wizard={wizard} />
        </form>
      </section>

      <SuccessModal
        open={wizard.modal === 'saved'}
        onOpenChange={(open) => {
          if (open) return;
          wizard.closeModal();
          router.push(`${CV_BUILDER_ROUTES.root}?state=draft`);
        }}
        title={t('saved-modal.title')}
        description={t('saved-modal.description')}
      />
      <DeleteModal
        open={wizard.modal === 'delete-draft'}
        onOpenChange={(open) => !open && wizard.closeModal()}
        title={t('delete-modal.title')}
        description={t('delete-modal.description')}
        confirmLabel={t('delete-modal.confirm')}
        cancelLabel={t('delete-modal.cancel')}
        isLoading={wizard.isDeletingDraft}
        onConfirm={wizard.confirmDeleteDraft}
      />
      {wizard.modal === 'preview' && (
        <CvViewModal
          values={wizard.form.getValues()}
          onOpenChange={(open) => !open && wizard.closeModal()}
          onEdit={() => {
            wizard.closeModal();
            wizard.goToStep(0);
          }}
        />
      )}
    </FormProvider>
  );
}
