import { Suspense } from 'react';
import PipelineFiltersRoute from '@/features/jobs/components/pipeline/PipelineFiltersRoute';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function Page() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <PipelineFiltersRoute />
    </Suspense>
  );
}
