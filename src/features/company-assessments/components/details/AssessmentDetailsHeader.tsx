'use client';

import { useTranslations } from 'next-intl';
import type { SavedAssessment } from '../../types/assessment-builder.types';
import AssessmentDetailsActions from './AssessmentDetailsActions';

type AssessmentDetailsHeaderProps = { assessment: SavedAssessment };

export default function AssessmentDetailsHeader({
  assessment,
}: AssessmentDetailsHeaderProps) {
  const t = useTranslations('companyPage.assessments');

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0 space-y-1">
        <h1 className="text-xl font-bold text-secondary md:text-2xl">
          {assessment.configuration.title}
        </h1>
        {/* The API returns a relative time ("2 days ago"), shown as is. */}
        <p className="text-xs text-muted-foreground">
          {t('created-at', { time: assessment.createdAt })}
        </p>
      </div>
      <AssessmentDetailsActions
        assessmentId={assessment.id}
        assessmentTitle={assessment.configuration.title}
        categoryId={assessment.categoryId}
        canManage={assessment.source === 'company'}
      />
    </header>
  );
}
