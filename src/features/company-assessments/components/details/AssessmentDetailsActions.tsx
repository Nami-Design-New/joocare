'use client';

import { useState } from 'react';
import { EyeOff, Pencil, RefreshCw, Share2, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import AlertModal from '@/shared/components/modals/AlertModal';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import { Button } from '@/shared/components/ui/button';

export default function AssessmentDetailsActions({
  isPaused,
  assessmentId,
  assessmentTitle,
  categoryId,
  onPauseToggle,
}: {
  isPaused: boolean;
  assessmentId: string;
  assessmentTitle: string;
  categoryId: string;
  onPauseToggle: () => void;
}) {
  const t = useTranslations('companyPage.assessments.details');
  const assessmentT = useTranslations('companyPage.assessments');
  const router = useRouter();
  const [pauseOpen, setPauseOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const editHref = `/company/assessments/${categoryId}/create?assessmentId=${assessmentId}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
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
            ? 'bg-success hover:bg-success/90 rounded-full px-4 text-white'
            : 'bg-warning/20 text-warning-foreground hover:bg-warning/30 rounded-full px-4'
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
        className="bg-success hover:bg-success/90 rounded-full px-4 text-white"
      >
        <Link href={editHref}>
          <Pencil aria-hidden="true" className="size-3.5" />
          {t('edit-assessment')}
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t('share')}
        disabled={isPaused}
        onClick={() => toast.info(assessmentT('coming-soon'))}
      >
        <Share2 aria-hidden="true" className="size-4" />
      </Button>
      <AlertModal
        open={pauseOpen}
        onOpenChange={setPauseOpen}
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
        onConfirm={() => {
          onPauseToggle();
          setPauseOpen(false);
        }}
      />
      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={assessmentT('delete-assessment-title')}
        description={assessmentT('delete-assessment-description')}
        confirmLabel={assessmentT('confirm-delete-assessment')}
        cancelLabel={assessmentT('cancel')}
        onConfirm={() => {
          setDeleteOpen(false);
          router.push(`/company/assessments/${categoryId}`);
        }}
      />
    </div>
  );
}
