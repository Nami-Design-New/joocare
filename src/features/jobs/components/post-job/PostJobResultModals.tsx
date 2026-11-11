'use client';

import { ArrowRight, Lightbulb, Megaphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import IllustratedModal from '@/shared/components/modals/IllustratedModal';
import ModalInfoPanel from '@/shared/components/modals/ModalInfoPanel';
import { JOB_STATUS_MODAL_IMAGES } from '../../constants';

type PostJobResultModalsProps = {
  savedOpen: boolean;
  onSavedOpenChange: (open: boolean) => void;
  publishedOpen: boolean;
  onPublishedOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  jobId?: number | string | null;
};

const ARROW = (
  <ArrowRight aria-hidden="true" className="size-5 rtl:rotate-180" />
);
const JOB_MANAGEMENT_PATH = '/company/job-management';

// "Saved Successfully!" (Figma 10086:88528) and "Congratulations!" (10895:61678).
export default function PostJobResultModals({
  savedOpen,
  onSavedOpenChange,
  publishedOpen,
  onPublishedOpenChange,
  isEditMode,
  jobId,
}: PostJobResultModalsProps) {
  const t = useTranslations('companyPage.postJob.modals');
  const router = useRouter();

  return (
    <>
      <IllustratedModal
        open={savedOpen}
        onOpenChange={onSavedOpenChange}
        imageSrc={JOB_STATUS_MODAL_IMAGES.saved}
        title={t('savedSuccessfully.title')}
        description={t('savedSuccessfully.description')}
        actions={[
          {
            label: t('savedSuccessfully.go-to-management'),
            icon: ARROW,
            href: JOB_MANAGEMENT_PATH,
          },
          {
            label: t('savedSuccessfully.continue-editing'),
            variant: 'outline',
            onClick: () => onSavedOpenChange(false),
          },
        ]}
      >
        <ModalInfoPanel
          title={t('savedSuccessfully.callout-title')}
          description={t('savedSuccessfully.callout-description')}
          icon={
            <span className="flex size-13 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Lightbulb aria-hidden="true" className="size-6" />
            </span>
          }
        />
      </IllustratedModal>

      <IllustratedModal
        open={publishedOpen}
        onOpenChange={onPublishedOpenChange}
        // Figma: closing goes back to Job Management.
        onCloseClick={() => router.push(JOB_MANAGEMENT_PATH)}
        imageSrc={JOB_STATUS_MODAL_IMAGES.published}
        title={
          isEditMode
            ? t('postSuccess.updatedTitle')
            : t('postSuccess.congrats-title')
        }
        subtitle={isEditMode ? undefined : t('postSuccess.published-subtitle')}
        description={
          isEditMode
            ? t('postSuccess.updatedDescription')
            : t('postSuccess.publishedDescription')
        }
        actions={[
          {
            label: t('postSuccess.view-job'),
            variant: 'outline',
            href: jobId ? `/company/job/${jobId}` : JOB_MANAGEMENT_PATH,
          },
          {
            label: t('postSuccess.go-to-dashboard'),
            icon: ARROW,
            href: '/company/dashboard',
          },
        ]}
      >
        {isEditMode ? null : (
          <ModalInfoPanel
            title={t('postSuccess.callout-title')}
            description={t('postSuccess.callout-description')}
            icon={
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Megaphone aria-hidden="true" className="size-6.5" />
              </span>
            }
          />
        )}
      </IllustratedModal>
    </>
  );
}
