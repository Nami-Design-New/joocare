'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import HttpStatusState from '@/shared/components/HttpStatusState';
import { useGetAssessment } from '../../hooks/useGetAssessment';
import { useGetAssessmentCategory } from '../../hooks/useGetAssessmentCategory';
import { getCategoryHref } from '../../utils/assessment-source';
import AssessmentsLoading from '../shared/AssessmentsLoading';
import AssessmentBuilder from './AssessmentBuilder';

type CreateAssessmentPageProps = {
  categoryId: string;
  assessmentId?: string;
};

export default function CreateAssessmentPage({
  categoryId,
  assessmentId,
}: CreateAssessmentPageProps) {
  const t = useTranslations('companyPage.assessments');
  // The builder adds `?assessmentId=` after step 1; only the id present on
  // first load opens the page in edit mode.
  const [initialAssessmentId] = useState(assessmentId ?? null);
  const category = useGetAssessmentCategory(categoryId, 'company');
  const assessment = useGetAssessment(initialAssessmentId);

  if (category.isPending || (initialAssessmentId && assessment.isPending))
    return <AssessmentsLoading variant="details" />;

  if (category.isError)
    return (
      <HttpStatusState
        statusCode={404}
        title={t('category-not-found')}
        description={t('category-not-found-description')}
        primaryHref="/company/assessments"
        primaryLabel={t('back-to-categories')}
      />
    );

  if (initialAssessmentId && !assessment.data)
    return (
      <HttpStatusState
        statusCode={404}
        title={t('assessment-not-found')}
        description={t('assessment-not-found-description')}
        primaryHref={getCategoryHref(categoryId, 'company')}
        primaryLabel={t('back-to-assessments')}
      />
    );

  return (
    <AssessmentBuilder
      categoryId={categoryId}
      initialAssessment={assessment.data}
    />
  );
}
