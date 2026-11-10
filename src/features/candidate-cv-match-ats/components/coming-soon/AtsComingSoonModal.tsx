'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import IllustratedModal from '@/shared/components/modals/IllustratedModal';
import { ATS_ASSETS } from '../../constants';
import AtsComingSoonFeatures from './AtsComingSoonFeatures';

type AtsComingSoonModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// "AI CV Analysis & ATS Matching is coming soon" (Figma 11531:118041).
export default function AtsComingSoonModal({
  open,
  onOpenChange,
}: AtsComingSoonModalProps) {
  const t = useTranslations('candidatePage.cvMatchAts.coming-soon');

  return (
    <IllustratedModal
      open={open}
      onOpenChange={onOpenChange}
      imageSrc={ATS_ASSETS.comingSoon}
      badge={
        // Overlaps the bottom of the illustration, as in the design.
        <span className="bg-ats-badge text-ats-primary relative -mt-14 rounded-full border-3 border-white px-4.5 py-1.5 text-base font-semibold uppercase">
          {t('badge')}
        </span>
      }
      title={t('title')}
      description={t('description')}
      actions={[
        {
          label: t('notify'),
          icon: <Image src={ATS_ASSETS.bell} alt="" width={20} height={20} />,
          iconPosition: 'start',
          className: 'bg-ats-primary hover:bg-ats-primary/90 sm:w-85',
          onClick: () => {
            // No API yet: confirm locally.
            toast.success(t('notify-toast'));
            onOpenChange(false);
          },
        },
      ]}
      footnote={t('footnote')}
    >
      <AtsComingSoonFeatures />
    </IllustratedModal>
  );
}
