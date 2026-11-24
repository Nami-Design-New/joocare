import AssessmentResultsPage from '@/features/company-assessments/components/results/AssessmentResultsPage';
import { EXTERNAL_PARAM } from '@/features/company-assessments/constants/assessment-results';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const assessment = params.assessment;
  return (
    <AssessmentResultsPage
      initialAssessmentId={
        typeof assessment === 'string' ? assessment : undefined
      }
      isExternal={params[EXTERNAL_PARAM] === '1'}
    />
  );
}
