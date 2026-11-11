'use client';

import { Button } from '@/shared/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

type AssessmentFilterProps = {
  children: ReactNode;
  onReset: () => void;
};

export default function AssessmentFilter({
  children,
  onReset,
}: AssessmentFilterProps) {
  const t = useTranslations('companyPage.assessments');
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-muted/60 p-2 shadow-soft">
      <div className="min-w-0 flex-1">{children}</div>
      <Button
        variant="ghost"
        size="icon-circle"
        className="size-12 bg-muted text-secondary"
        aria-label={t('reset-filter')}
        title={t('reset-filter')}
        onClick={onReset}
      >
        <RefreshCw aria-hidden="true" className="size-5" />
      </Button>
    </div>
  );
}
