'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Link } from '@/i18n/navigation';
import { ASSESSMENT_ASSETS } from '../../constants/assessment-invitations';

type AssessmentSentSuccessProps = {
  statusHref: string;
  onAssignAnother: () => void;
  onClose: () => void;
};

export default function AssessmentSentSuccess({
  statusHref,
  onAssignAnother,
  onClose,
}: AssessmentSentSuccessProps) {
  const t = useTranslations('companyPage.assessments.assignment');
  const items = [
    {
      icon: 'mail.svg',
      title: 'candidate-notified',
      description: 'candidate-notified-description',
    },
    {
      icon: 'file.svg',
      title: 'assessment-assigned',
      description: 'assessment-assigned-description',
    },
    { icon: 'clock.svg', title: 'ready', description: 'ready-description' },
  ] as const;
  return (
    <div className="relative flex flex-col items-center gap-5 px-6 pt-10 pb-9 sm:px-10">
      <DialogClose asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label={t('close')}
          className="bg-assessment-close absolute end-6 top-6 size-10 rounded-full"
        >
          <Image
            src={`${ASSESSMENT_ASSETS}/close-success.svg`}
            width={12.375}
            height={12.375}
            alt=""
          />
        </Button>
      </DialogClose>
      <div className="relative h-[242px] w-[230px] shrink-0 overflow-hidden">
        <Image
          src={`${ASSESSMENT_ASSETS}/sent-success.png`}
          width={265}
          height={265}
          alt=""
          className="absolute -start-[9.5%] -top-[5.71%] h-[109.52%] w-[115%] max-w-none"
        />
      </div>
      <div className="w-full space-y-2.5 text-center">
        <DialogTitle className="text-assessment-main text-[30px] leading-[1.2] font-bold">
          {t('success-title')}
        </DialogTitle>
        <DialogDescription className="text-assessment-copy text-[17px] leading-[1.5]">
          {t('success-description')}
        </DialogDescription>
      </div>
      <div className="bg-assessment-info divide-assessment-info-border flex w-full flex-col divide-y rounded-[18px] px-4 py-[22px] sm:min-h-[176px] sm:flex-row sm:divide-x sm:divide-y-0 rtl:divide-x-reverse">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex min-w-0 flex-1 flex-col items-center gap-1.5 px-2 py-3 text-center sm:py-0"
          >
            <span className="bg-assessment-info-icon mb-2.5 flex size-12 items-center justify-center rounded-full">
              <Image
                src={`${ASSESSMENT_ASSETS}/${item.icon}`}
                width={24}
                height={24}
                alt=""
              />
            </span>
            <p className="text-assessment-main text-base leading-[1.3] font-semibold">
              {t(item.title)}
            </p>
            <p className="text-assessment-copy text-sm leading-[1.4]">
              {t(item.description)}
            </p>
          </div>
        ))}
      </div>
      <div className="flex w-full flex-col gap-4 pt-2 sm:flex-row">
        <Button
          variant="outline"
          onClick={onAssignAnother}
          className="border-assessment-outline text-assessment-main h-[52px] flex-1 rounded-full border-[1.5px] px-4 text-base font-semibold"
        >
          {t('assign-another')}
        </Button>
        <Button
          asChild
          className="bg-assessment-primary h-[52px] flex-1 gap-2.5 rounded-full px-4 text-base font-semibold"
        >
          <Link href={statusHref} onClick={onClose}>
            {t('view-status')}
            <Image
              src={`${ASSESSMENT_ASSETS}/arrow.svg`}
              width={20}
              height={20}
              alt=""
              className="rtl:rotate-180"
            />
          </Link>
        </Button>
      </div>
    </div>
  );
}
