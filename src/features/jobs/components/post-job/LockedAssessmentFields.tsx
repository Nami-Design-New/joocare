'use client';

import { useTranslations } from 'next-intl';
import { useGetAssessment } from '@/features/company-assessments/hooks/useGetAssessment';
import AssessmentsErrorState from '@/features/company-assessments/components/shared/AssessmentsErrorState';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { Skeleton } from '@/shared/components/ui/skeleton';
import AssessmentPreviewButton from './AssessmentPreviewButton';

type LockedAssessmentFieldsProps = {
  assessmentId: string;
};

// Read-only view of the assessment saved with the job; the backend keeps it fixed.
export default function LockedAssessmentFields({
  assessmentId,
}: LockedAssessmentFieldsProps) {
  const t = useTranslations('companyPage.postJob.assessment');
  const assessment = useGetAssessment(assessmentId);

  if (assessment.isError) {
    return (
      <AssessmentsErrorState
        className="mt-4"
        onRetry={() => void assessment.refetch()}
      />
    );
  }
  if (!assessment.data) {
    return <Skeleton aria-busy="true" className="mt-4 h-40 rounded-2xl" />;
  }

  const { source, categoryId, categoryName, configuration } = assessment.data;
  const fields = [
    {
      id: 'assessment-library',
      label: t('library-label'),
      option: { value: source, label: t(`library-${source}`) },
    },
    {
      id: 'assessment-category',
      label: t('category-label'),
      option: { value: categoryId, label: categoryName },
    },
    {
      id: 'assessment-select',
      label: t('assessment-label'),
      option: { value: assessmentId, label: configuration.title },
    },
  ];

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
      {fields.map(({ id, label, option }) => (
        <SelectInputField
          key={id}
          id={id}
          className="bg-white"
          label={label}
          options={[option]}
          value={option.value}
          disabled
        />
      ))}
      <AssessmentPreviewButton assessmentId={assessmentId} />
    </div>
  );
}
