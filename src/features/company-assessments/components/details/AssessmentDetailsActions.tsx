'use client';

import { useState } from 'react';
import { EyeOff, Pencil, Share2, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import { Button } from '@/shared/components/ui/button';
import { useAssessmentActions } from '../../hooks/useAssessmentActions';
import { useDeleteAssessment } from '../../hooks/useDeleteAssessment';
import AssignAssessmentDialog from '../shared/AssignAssessmentDialog';

type AssessmentDetailsActionsProps = {
  assessmentId: string;
  assessmentTitle: string;
  categoryId: string;
  /** Joocare library assessments can only be shared. */
  canManage: boolean;
};

export default function AssessmentDetailsActions({
  assessmentId,
  assessmentTitle,
  categoryId,
  canManage,
}: AssessmentDetailsActionsProps) {
  const t = useTranslations('companyPage.assessments.details');
  const assessmentT = useTranslations('companyPage.assessments');
  const router = useRouter();
  const { showComingSoon } = useAssessmentActions();
  const deleteMutation = useDeleteAssessment();
  const [deleteOpen, setDeleteOpen] = useState(false);
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
          {/* `#` marks pause/resume: there is no endpoint for it yet. */}
          <Button
            size="sm"
            variant="ghost"
            className="rounded-full bg-warning/20 px-4 text-warning-foreground hover:bg-warning/30"
            onClick={showComingSoon}
          >
            <EyeOff aria-hidden="true" className="size-3.5" />
            {t('pause')} #
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
        size="icon-sm"
        aria-label={t('share')}
        onClick={() => setAssignOpen(true)}
      >
        <Share2 aria-hidden="true" className="size-4" />
      </Button>
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
        statusHref={`${categoryHref}/${assessmentId}/external-invitations`}
      />
    </div>
  );
}
