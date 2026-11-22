'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/shared/components/ui/badge';

// Orange "Paused" pill shared by the assessment card and the details header.
export default function AssessmentPausedBadge() {
  const t = useTranslations('companyPage.assessments');

  return (
    <Badge className="rounded-full border-none bg-warning/15 text-[10px] text-warning">
      {t('paused')}
    </Badge>
  );
}
