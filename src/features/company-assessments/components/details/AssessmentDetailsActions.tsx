'use client';

import { Button } from '@/shared/components/ui/button';
import { EyeOff, Pencil, RefreshCw, Share2, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAssessmentActions } from '../../hooks/useAssessmentActions';

export default function AssessmentDetailsActions({
  isPaused,
}: {
  isPaused: boolean;
}) {
  const t = useTranslations('companyPage.assessments.details');
  const { showComingSoon } = useAssessmentActions();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant="destructive"
        className="rounded-full px-4"
        onClick={showComingSoon}
      >
        <Trash2 aria-hidden="true" className="size-3.5" />
        {t('delete')}
      </Button>
      <Button
        size="sm"
        variant={isPaused ? 'secondary' : 'ghost'}
        className={
          isPaused
            ? 'bg-success hover:bg-success/90 rounded-full px-4 text-white'
            : 'bg-warning/20 text-warning-foreground hover:bg-warning/30 rounded-full px-4'
        }
        onClick={showComingSoon}
      >
        {isPaused ? (
          <RefreshCw aria-hidden="true" className="size-3.5" />
        ) : (
          <EyeOff aria-hidden="true" className="size-3.5" />
        )}
        {isPaused ? t('unpause') : t('pause')}
      </Button>
      <Button
        size="sm"
        className="bg-success hover:bg-success/90 rounded-full px-4 text-white"
        onClick={showComingSoon}
      >
        <Pencil aria-hidden="true" className="size-3.5" />
        {t('edit-assessment')}
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t('share')}
        disabled={isPaused}
        onClick={showComingSoon}
      >
        <Share2 aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}
