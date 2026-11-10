'use client';

import { Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import IllustratedModal from '@/shared/components/modals/IllustratedModal';
import { JOB_STATUS_MODAL_IMAGES } from '../../constants';

type AiJdBuilderModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// "AI JD Builder is coming soon" (Figma 11531:110531).
export default function AiJdBuilderModal({ open, onOpenChange }: AiJdBuilderModalProps) {
  const t = useTranslations('companyPage.postJob.aiBuilder');
  const close = () => onOpenChange(false);

  return (
    <IllustratedModal
      open={open}
      onOpenChange={onOpenChange}
      closePosition="start"
      imageSrc={JOB_STATUS_MODAL_IMAGES.aiJdBuilder}
      badge={
        <span className="bg-warning/15 text-warning-strong rounded-full px-3 py-1 text-xs font-bold tracking-wide">
          {t('badge')}
        </span>
      }
      title={t('title')}
      description={t('description')}
      actions={[
        { label: t('got-it'), onClick: close, className: 'bg-secondary hover:bg-secondary/90 sm:flex-[1.4]' },
        {
          label: t('notify'),
          variant: 'outline',
          icon: <Bell aria-hidden="true" className="size-4.5" />,
          iconPosition: 'start',
          onClick: () => {
            // No API yet: confirm locally.
            toast.success(t('notify-toast'));
            close();
          },
        },
      ]}
    />
  );
}
