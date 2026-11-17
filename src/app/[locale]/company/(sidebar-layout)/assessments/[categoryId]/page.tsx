import CategoryAssessmentsPage from '@/features/company-assessments/components/assessments/CategoryAssessmentsPage';
import { parseAssessmentSource } from '@/features/company-assessments/utils/assessment-source';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ source?: string }>;
}) {
  const [{ categoryId }, { source }] = await Promise.all([
    params,
    searchParams,
  ]);
  const librarySource = parseAssessmentSource(source);
  return (
    <CategoryAssessmentsPage
      key={`${librarySource}-${categoryId}`}
      categoryId={categoryId}
      source={librarySource}
    />
  );
}
