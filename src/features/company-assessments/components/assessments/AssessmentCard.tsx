'use client';

import {
  CircleEllipsis,
  Info,
  Pencil,
  Pause,
  Play,
  Stethoscope,
  Trash2,
} from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import AlertModal from '@/shared/components/modals/AlertModal';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import type {
  Assessment,
  AssessmentSource,
} from '../../types/assessment.types';
import AssessmentStats from './AssessmentStats';
import AssessmentActions from './AssessmentActions';

type AssessmentCardProps = {
  assessment: Assessment;
  source: AssessmentSource;
  href?: string;
  onPause?: () => void;
  onDelete?: () => void;
};

export default function AssessmentCard({
  assessment,
  source,
  href,
  onPause,
  onDelete,
}: AssessmentCardProps) {
  const t = useTranslations('companyPage.assessments');
  const detailsT = useTranslations('companyPage.assessments.details');
  const format = useFormatter();
  const [pauseOpen, setPauseOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const isPaused = Boolean(assessment.pausedAt);
  const title = assessment.title;
  const pausedDate = assessment.pausedAt
    ? format.dateTime(new Date(assessment.pausedAt), {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
    : null;

  return (
    <Card className="gap-4 rounded-[28px] border-none p-4 shadow-none">
      <div className="flex items-start gap-3">
        <span className="bg-primary-bg text-primary flex size-11 shrink-0 items-center justify-center rounded-full">
          <Stethoscope
            aria-hidden="true"
            className="size-6"
            strokeWidth={1.5}
          />
        </span>
        <div className="min-w-0 flex-1 space-y-1 self-center">
          <h2 className="text-secondary text-sm font-semibold">{title}</h2>
          <p className="text-muted-foreground text-xs">
            {source === 'joocare'
              ? t('admin')
              : t('created-on', {
                date: format.dateTime(new Date(assessment.createdAt), {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  timeZone: 'UTC',
                }),
              })}
          </p>
        </div>
        {source === 'company' ? (
          <div className="flex shrink-0 items-center gap-2">
            {assessment.pausedAt ? (
              <Badge className="bg-warning/15 text-warning rounded-full border-none text-[10px]">
                {t('paused')}
              </Badge>
            ) : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground size-7 rounded-full"
                  aria-label={t('assessment-actions', { name: title })}
                >
                  <CircleEllipsis aria-hidden="true" className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/company/assessments/${assessment.categoryId}/create?assessmentId=${assessment.id}`}
                  >
                    <Pencil aria-hidden="true" className="size-4" />
                    {detailsT('edit-assessment')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setPauseOpen(true)}>
                  {isPaused ? (
                    <Play aria-hidden="true" className="size-4" />
                  ) : (
                    <Pause aria-hidden="true" className="size-4" />
                  )}
                  {isPaused ? detailsT('unpause') : detailsT('pause')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => setDeleteOpen(true)}
                >
                  <Trash2 aria-hidden="true" className="size-4 text-destructive" />
                  {t('delete-action')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}
      </div>
      {pausedDate ? (
        <p className="bg-warning/15 text-warning flex items-start gap-2 rounded-xl px-3 py-2 text-xs leading-5">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {t('paused-notice', { date: pausedDate })}
        </p>
      ) : (
        <p className="text-muted-foreground line-clamp-2 text-xs leading-5">
          {assessment.description}
        </p>
      )}
      <AssessmentStats assessment={assessment} />
      <AssessmentActions
        assessment={assessment}
        source={source}
        previewHref={href}
      />
      <AlertModal
        open={pauseOpen}
        onOpenChange={setPauseOpen}
        title={t(
          isPaused ? 'unpause-assessment-title' : 'pause-assessment-title',
          { name: title },
        )}
        description={isPaused ? t('unpause-assessment-description') : undefined}
        confirmLabel={t(isPaused ? 'confirm-unpause' : 'confirm-pause')}
        cancelLabel={t('cancel')}
        confirmButtonVariant={isPaused ? 'default' : 'destructive'}
        onConfirm={() => {
          onPause?.();
          setPauseOpen(false);
        }}
      />
      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('delete-assessment-title')}
        description={t('delete-assessment-description')}
        confirmLabel={t('confirm-delete-assessment')}
        cancelLabel={t('cancel')}
        onConfirm={() => {
          onDelete?.();
          setDeleteOpen(false);
        }}
      />
    </Card>
  );
}
