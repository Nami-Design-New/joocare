'use client';

import { CheckCheck, Edit, EyeOff, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { useJobStatusActions } from '../hooks/useJobStatusActions';
import type { JobStatus } from '../types/index.types';
import { getCompletePostHref, getEditJobHref } from '../utils';
import JobStatusModals from './status/JobStatusModals';

type JobActionButtonsProps = {
  jobId?: number | string;
  currentStatus?: JobStatus;
  deleteRedirectTo?: string;
};

// Figma: equal pills, 34px high, 14px regular.
const BUTTON_CLASS = 'h-8.5 flex-1 gap-1 rounded-full px-3 text-sm font-normal';
const ICON_CLASS = 'size-4';

export function JobActionButtons({
  jobId,
  currentStatus = 'open',
  deleteRedirectTo,
}: JobActionButtonsProps) {
  const t = useTranslations();
  const actions = useJobStatusActions({ deleteRedirectTo });
  if (!jobId) return null;

  const job = { id: jobId, status: currentStatus };
  const deleteButton = (
    <Button
      variant="destructive"
      className={BUTTON_CLASS}
      disabled={actions.isDeleting}
      onClick={() => actions.open('delete', job)}
    >
      <Trash2 aria-hidden="true" className={ICON_CLASS} />
      {t('companyPage.jobs.actions.delete')}
    </Button>
  );

  return (
    <>
      <div className="flex w-full gap-2">
        {currentStatus === 'open' ? (
          <>
            <Button asChild className={BUTTON_CLASS}>
              <Link href={getEditJobHref(jobId)}>
                <Edit aria-hidden="true" className={ICON_CLASS} />
                {t('common.edit')}
              </Link>
            </Button>
            <Button
              className={cn(BUTTON_CLASS, 'bg-caution hover:bg-caution/90 text-white')}
              disabled={actions.isPending}
              onClick={() => actions.open('pause', job)}
            >
              <EyeOff aria-hidden="true" className={ICON_CLASS} />
              {t('companyPage.jobs.actions.pause')}
            </Button>
            <Button
              variant="destructive"
              className={BUTTON_CLASS}
              disabled={actions.isPending}
              onClick={() => actions.open('close', job)}
            >
              <CheckCheck aria-hidden="true" className={ICON_CLASS} />
              {t('companyPage.jobs.actions.close')}
            </Button>
          </>
        ) : null}
        {currentStatus === 'paused' || currentStatus === 'closed' ? (
          <>
            <Button
              className={BUTTON_CLASS}
              disabled={actions.isPending}
              onClick={() => actions.open('resume', job)}
            >
              {t('companyPage.jobs.actions.resume')}
            </Button>
            {deleteButton}
          </>
        ) : null}
        {currentStatus === 'draft' ? (
          <>
            <Button asChild className={BUTTON_CLASS}>
              <Link href={getCompletePostHref(jobId)}>
                {t('companyPage.jobs.actions.complete-post')}
              </Link>
            </Button>
            {deleteButton}
          </>
        ) : null}
      </div>
      <JobStatusModals actions={actions} backHref="/company/job-management" />
    </>
  );
}

export default JobActionButtons;
