'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { AI_MATCH_TAB } from '../../constants';
import JobCandidatesHeader from './JobCandidatesHeader';
import PipelineCandidatesTab from './PipelineCandidatesTab';
import AiTalentMatchTab from './AiTalentMatchTab';

export default function JobCandidatesPage() {
  const params = useParams<{ slug: string }>();
  const jobId = Number(params.slug);
  const isAiMatch = useSearchParams().get('tab') === AI_MATCH_TAB;

  if (!Number.isFinite(jobId)) return null;

  return (
    <section className="flex min-w-0 flex-col gap-6 md:gap-11">
      <JobCandidatesHeader jobId={jobId} />
      {isAiMatch ? (
        <AiTalentMatchTab jobId={jobId} />
      ) : (
        <PipelineCandidatesTab jobId={jobId} />
      )}
    </section>
  );
}
