import { Info } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { ASSESSMENT_LINK_VALIDITY_HOURS } from '@/features/candidate-assessment/constants';
import {
  formatAssessmentDateTime,
  getAssessmentLinkExpiry,
} from '@/features/candidate-assessment/utils/assessment-format';

type AssessmentLinkNoticeProps = {
  email: string;
  sentAt: Date;
};

// Blue note in the "assessment required" modal: the link works for 72 hours.
export default function AssessmentLinkNotice({
  email,
  sentAt,
}: AssessmentLinkNoticeProps) {
  const t = useTranslations('jobDetailsPage.apply.submitted-with-assessment');
  const locale = useLocale();
  const values = {
    hours: ASSESSMENT_LINK_VALIDITY_HOURS,
    sentAt: formatAssessmentDateTime(sentAt, locale),
    expiresAt: formatAssessmentDateTime(
      getAssessmentLinkExpiry(sentAt),
      locale,
    ),
  };

  return (
    <div className="bg-assessment-link-info border-assessment-link-info-border text-assessment-link-info-text mt-6 flex items-start gap-2.5 rounded-xl border p-4 text-start">
      <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold">{t('notice-title', values)}</p>
        <p className="text-xs leading-4.5">
          {email
            ? t.rich('notice-sent-to', {
                ...values,
                email: () => <bdi>{email}</bdi>,
              })
            : t('notice-sent', values)}{' '}
          {t('notice-later')}
        </p>
      </div>
    </div>
  );
}
