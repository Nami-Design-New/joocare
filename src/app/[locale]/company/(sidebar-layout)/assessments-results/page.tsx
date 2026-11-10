import AssessmentResultsPage from '@/features/company-assessments/components/results/AssessmentResultsPage';

type PageProps = {
  searchParams: Promise<{ assessment?: string | string[] }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { assessment } = await searchParams;
  return (
    <AssessmentResultsPage
      initialAssessmentId={
        typeof assessment === 'string' ? assessment : undefined
      }
    />
  );
}
