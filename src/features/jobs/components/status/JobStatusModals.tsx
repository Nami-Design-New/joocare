'use client';

import { ArrowRight, Pause } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import IllustratedModal from '@/shared/components/modals/IllustratedModal';
import ModalInfoPanel from '@/shared/components/modals/ModalInfoPanel';
import { JOB_STATUS_MODAL_IMAGES } from '../../constants';
import type { JobStatusActions } from '../../hooks/useJobStatusActions';

type JobStatusModalsProps = {
  actions: JobStatusActions;
  // Where "Back to Job Postings" goes; omit to just close (listing page).
  backHref?: string;
};

const ARROW = <ArrowRight aria-hidden="true" className="size-5 rtl:rotate-180" />;

export default function JobStatusModals({ actions, backHref }: JobStatusModalsProps) {
  const t = useTranslations('companyPage.jobs.card.modals');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { action, success, target, isPending } = actions;
  const isResumeFromClosed = target?.status === 'closed';
  const closeAction = () => actions.closeAction();
  const closeSuccess = () => {
    actions.closeSuccess();
    if (backHref) router.push(backHref);
  };

  return (
    <>
      <IllustratedModal
        open={action === 'pause'}
        onOpenChange={(open) => !open && closeAction()}
        isBusy={isPending}
        imageSrc={JOB_STATUS_MODAL_IMAGES.pause}
        title={t('pause.title')}
        description={t('pause.description')}
        actions={[
          {
            label: t('pause.confirm'),
            icon: <Pause aria-hidden="true" className="size-5" />,
            iconPosition: 'start',
            onClick: actions.confirm,
            isLoading: isPending,
            className: 'bg-warning hover:bg-warning/90 text-white',
          },
          { label: t('pause.cancel'), variant: 'outline', onClick: closeAction, disabled: isPending },
        ]}
      >
        <ModalInfoPanel
          tone="warning"
          title={t('pause.panel-title')}
          items={[t('pause.item-one'), t('pause.item-two'), t('pause.item-three'), t('pause.item-four')]}
        />
      </IllustratedModal>

      <IllustratedModal
        open={action === 'resume'}
        onOpenChange={(open) => !open && closeAction()}
        isBusy={isPending}
        imageSrc={JOB_STATUS_MODAL_IMAGES.resume}
        title={t('reactivate.title')}
        description={t('reactivate.description')}
        actions={[
          { label: t('reactivate.confirm'), icon: ARROW, onClick: actions.confirm, isLoading: isPending },
          {
            label: t(isResumeFromClosed ? 'reactivate.cancel-closed' : 'reactivate.cancel'),
            variant: 'outline',
            onClick: closeAction,
            disabled: isPending,
          },
        ]}
      >
        <ModalInfoPanel
          title={t('reactivate.panel-title')}
          items={[t('reactivate.item-one'), t('reactivate.item-two'), t('reactivate.item-three'), t('reactivate.item-four')]}
        />
      </IllustratedModal>

      <IllustratedModal
        open={action === 'close'}
        onOpenChange={(open) => !open && closeAction()}
        isBusy={isPending}
        imageSrc={JOB_STATUS_MODAL_IMAGES.close}
        title={t('close.title')}
        description={t('close.description')}
        actions={[
          { label: t('close.confirm'), icon: ARROW, onClick: actions.confirm, isLoading: isPending },
          { label: t('close.cancel'), variant: 'outline', onClick: closeAction, disabled: isPending },
        ]}
      >
        <ModalInfoPanel
          title={t('close.panel-title')}
          items={[t('close.item-one'), t('close.item-two'), t('close.item-three')]}
        />
      </IllustratedModal>

      <DeleteModal
        open={action === 'delete'}
        onOpenChange={(open) => !open && closeAction()}
        title={t('delete.title')}
        description={t('delete.description')}
        confirmLabel={t('delete.confirm')}
        cancelLabel={tCommon('cancel')}
        onConfirm={actions.confirm}
        isLoading={actions.isDeleting}
      />

      <IllustratedModal
        open={success === 'closed'}
        onOpenChange={(open) => !open && actions.closeSuccess()}
        imageSrc={JOB_STATUS_MODAL_IMAGES.closed}
        title={t('closed-success.title')}
        description={t('closed-success.description')}
        actions={[{ label: t('closed-success.back'), icon: ARROW, onClick: closeSuccess }]}
      />
      <IllustratedModal
        open={success === 'resumed'}
        onOpenChange={(open) => !open && actions.closeSuccess()}
        imageSrc={JOB_STATUS_MODAL_IMAGES.resumed}
        title={t('resumed-success.title')}
        description={t('resumed-success.description')}
        actions={[{ label: t('resumed-success.back'), icon: ARROW, onClick: closeSuccess }]}
      />
    </>
  );
}
