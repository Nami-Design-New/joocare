import CreateAssessmentPage from '@/features/company-assessments/components/create/CreateAssessmentPage';
import {
  assessmentSeeds,
  createAssessmentDraft,
} from '@/features/company-assessments/constants/assessment-data';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ assessmentId?: string }>;
}) {
  const { categoryId } = await params;
  const { assessmentId } = await searchParams;
  const assessment = assessmentSeeds.find(
    (item) =>
      item.id === assessmentId &&
      item.categoryId === categoryId &&
      item.categoryId.startsWith('company-'),
  );

  return (
    <CreateAssessmentPage
      key={`${categoryId}-${assessment?.id ?? 'new'}`}
      categoryId={categoryId}
      isEditing={Boolean(assessment)}
      initialDraft={assessment ? createAssessmentDraft(assessment) : undefined}
    />
  );
}
