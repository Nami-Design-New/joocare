import AssessmentResultDetailsPage from '@/features/company-assessments/components/results/AssessmentResultDetailsPage';
import { EXTERNAL_PARAM } from '@/features/company-assessments/constants/assessment-results';

type PageProps = {
  params: Promise<{ assessmentId: string; resultId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { assessmentId, resultId } = await params;
  const query = await searchParams;
  return (
    <AssessmentResultDetailsPage
      key={resultId}
      assessmentId={assessmentId}
      resultId={resultId}
      isExternal={query[EXTERNAL_PARAM] === '1'}
    />
  );
}
