import AiJobMatchPage from '@/features/candidate-ai-job-match/components/AiJobMatchPage';
import type { AiJobMatchScenario } from '@/features/candidate-ai-job-match/types/ai-job-match.types';

type PageProps = {
  searchParams: Promise<{ scenario?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { scenario } = await searchParams;
  const view: AiJobMatchScenario = scenario === 'empty' ? 'empty' : 'empty';
  return <AiJobMatchPage key={view} scenario={view} />;
}
