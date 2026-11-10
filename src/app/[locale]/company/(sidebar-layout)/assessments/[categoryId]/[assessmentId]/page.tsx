import AssessmentDetailsPage from '@/features/company-assessments/components/details/AssessmentDetailsPage';

export default async function Page({
  params,
}: {
  params: Promise<{ categoryId: string; assessmentId: string }>;
}) {
  const { categoryId, assessmentId } = await params;
  return (
    <AssessmentDetailsPage
      key={`${categoryId}-${assessmentId}`}
      categoryId={categoryId}
      assessmentId={assessmentId}
    />
  );
}
