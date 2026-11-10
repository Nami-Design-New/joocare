'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export function useAssessmentActions() {
  const t = useTranslations('companyPage.assessments');
  return { showComingSoon: () => toast.info(t('coming-soon')) };
}
