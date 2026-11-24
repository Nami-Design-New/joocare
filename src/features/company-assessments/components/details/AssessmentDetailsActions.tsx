'use client';

import { useState } from 'react';
import {
  EyeOff,
  Pencil,
  RefreshCw,
  SquareArrowOutUpRight,
  Trash2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import AlertModal from '@/shared/components/modals/AlertModal';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import { Button } from '@/shared/components/ui/button';
import { useChangeAssessmentStatus } from '../../hooks/useChangeAssessmentStatus';
import { useDeleteAssessment } from '../../hooks/useDeleteAssessment';
import { getAssessmentResultsHref } from '../../utils/assessment-results';
import AssignAssessmentDialog from '../shared/AssignAssessmentDialog';

type AssessmentDetailsActionsProps = {
  assessmentId: string;
  assessmentTitle: string;
  categoryId: string;
  isPaused: boolean;
  /** Joocare library assessments can only be shared. */
  canManage: boolean;
};

export default function AssessmentDetailsActions({
  assessmentId,
  assessmentTitle,
  categoryId,
  isPaused,
  canManage,
}: AssessmentDetailsActionsProps) {
  const t = useTranslations('companyPage.assessments.details');
  const assessmentT = useTranslations('companyPage.assessments');
  const router = useRouter();
  const deleteMutation = useDeleteAssessment();
  const statusMutation = useChangeAssessmentStatus();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const categoryHref = `/company/assessments/${categoryId}`;
  const editHref = `${categoryHref}/create?assessmentId=${assessmentId}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canManage ? (
        <>
          <Button
            size="sm"
            variant="destructive"
            className="rounded-full px-4"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 aria-hidden="true" className="size-3.5" />
            {t('delete')}
          </Button>
          <Button
            size="sm"
            variant={isPaused ? 'secondary' : 'ghost'}
            className={
              isPaused
                ? 'rounded-full bg-success px-4 text-white hover:bg-success/90'
                : 'rounded-full bg-warning/20 px-4 text-warning-foreground hover:bg-warning/30'
            }
            onClick={() => setPauseOpen(true)}
          >
            {isPaused ? (
              <RefreshCw aria-hidden="true" className="size-3.5" />
            ) : (
              <EyeOff aria-hidden="true" className="size-3.5" />
            )}
            {isPaused ? t('unpause') : t('pause')}
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-success px-4 text-white hover:bg-success/90"
          >
            <Link href={editHref}>
              <Pencil aria-hidden="true" className="size-3.5" />
              {t('edit-assessment')}
            </Link>
          </Button>
        </>
      ) : null}
      <Button
        variant="ghost"
        size="icon"
        className="size-9 rounded-full bg-muted text-primary"
        aria-label={t('share')}
        title={assessmentT(isPaused ? 'sharing-disabled' : 'share')}
        disabled={isPaused}
        onClick={() => setAssignOpen(true)}
      >
        <SquareArrowOutUpRight aria-hidden="true" className="size-4" />
      </Button>
      <AlertModal
        open={pauseOpen}
        onOpenChange={(open) => {
          if (!statusMutation.isPending) setPauseOpen(open);
        }}
        title={assessmentT(
          isPaused ? 'unpause-assessment-title' : 'pause-assessment-title',
          { name: assessmentTitle },
        )}
        description={
          isPaused ? assessmentT('unpause-assessment-description') : undefined
        }
        confirmLabel={assessmentT(
          isPaused ? 'confirm-unpause' : 'confirm-pause',
        )}
        cancelLabel={assessmentT('cancel')}
        confirmButtonVariant={isPaused ? 'default' : 'destructive'}
        isLoading={statusMutation.isPending}
        onConfirm={() =>
          statusMutation.toggle({ assessmentId, isPaused }, () =>
            setPauseOpen(false),
          )
        }
      />
      <DeleteModal
        open={deleteOpen}
        onOpenChange={(open) =>
          !deleteMutation.isPending && setDeleteOpen(open)
        }
        title={assessmentT('delete-assessment-title')}
        description={assessmentT('delete-assessment-description')}
        confirmLabel={assessmentT('confirm-delete-assessment')}
        cancelLabel={assessmentT('cancel')}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteMutation.isPending) return;
          deleteMutation.mutate(assessmentId, {
            onSuccess: () => {
              setDeleteOpen(false);
              router.replace(categoryHref);
            },
          });
        }}
      />
      <AssignAssessmentDialog
        assessmentId={assessmentId}
        open={assignOpen}
        onOpenChange={setAssignOpen}
        assessmentTitle={assessmentTitle}
        statusHref={getAssessmentResultsHref(assessmentId, { external: true })}
      />
    </div>
  );
}
