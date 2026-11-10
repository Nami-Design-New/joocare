'use client';

import { useParams } from 'next/navigation';
import PipelineFiltersPage from './PipelineFiltersPage';

export default function PipelineFiltersRoute() {
  const params = useParams<{ slug: string }>();
  const jobId = Number(params.slug);

  if (!Number.isFinite(jobId)) return null;
  return <PipelineFiltersPage jobId={jobId} />;
}
