import { Suspense } from 'react';
import JobCandidatesPage from '@/features/jobs/components/pipeline/JobCandidatesPage';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function Page() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <JobCandidatesPage />
    </Suspense>
  );
}
