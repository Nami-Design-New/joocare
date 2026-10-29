'use client';

import { Eye, SquareArrowOutUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { useAssessmentActions } from '../../hooks/useAssessmentActions';
import type {
  Assessment,
  AssessmentSource,
} from '../../types/assessment.types';
import AssignAssessmentDialog from '../shared/AssignAssessmentDialog';

type AssessmentActionsProps = {
  assessment: Assessment;
  source: AssessmentSource;
  previewHref?: string;
};

export default function AssessmentActions({
  assessment,
  source,
  previewHref,
}: AssessmentActionsProps) {
  const t = useTranslations('companyPage.assessments');
  const { showComingSoon } = useAssessmentActions();
  const isCompany = source === 'company';
  const title = assessment.title;
  const [assignOpen, setAssignOpen] = useState(false);

  return (
    <div className="border-border flex flex-wrap items-center gap-2 border-t pt-3">
      <Button
        className="h-9 flex-1 rounded-full px-3 text-xs"
        onClick={showComingSoon}
      >
        {t('associated-jobs', { count: assessment.associatedJobs })}
      </Button>
      {isCompany ? (
        <Button
          variant="outline"
          className="border-primary text-primary h-9 flex-1 rounded-full px-3 text-xs"
          asChild
        >
          <Link
            href={`/company/assessments/${assessment.categoryId}/${assessment.id}/external-invitations`}
          >
            {t('external-invitations', {
              count: assessment.externalInvitations,
            })}
          </Link>
        </Button>
      ) : null}
      <Button
        asChild={Boolean(previewHref)}
        variant="ghost"
        className={
          isCompany
            ? 'bg-muted text-secondary size-9 rounded-full p-0'
            : 'bg-muted text-secondary h-9 flex-1 gap-2 rounded-full px-3 text-xs'
        }
        aria-label={t('preview-assessment', { name: title })}
        onClick={previewHref ? undefined : showComingSoon}
      >
        {previewHref ? (
          <Link href={previewHref}>
            <Eye aria-hidden="true" className="size-4" />
            {!isCompany ? t('preview') : null}
          </Link>
        ) : (
          <>
            <Eye aria-hidden="true" className="size-4" />
            {!isCompany ? t('preview') : null}
          </>
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="bg-muted text-primary size-9 rounded-full"
        aria-label={t('share-assessment', { name: title })}
        title={t(assessment.pausedAt ? 'sharing-disabled' : 'share')}
        disabled={Boolean(assessment.pausedAt)}
        onClick={() => setAssignOpen(true)}
      >
        <SquareArrowOutUpRight aria-hidden="true" className="size-4" />
      </Button>
      <AssignAssessmentDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        assessmentTitle={title}
        statusHref={`/company/assessments/${assessment.categoryId}/${assessment.id}/external-invitations`}
      />
    </div>
  );
}
