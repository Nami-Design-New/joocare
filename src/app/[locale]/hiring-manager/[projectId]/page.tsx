import type { Metadata } from 'next';
import { Suspense } from 'react';
import HiringManagerReviewPage from '@/features/hiring-manager/components/HiringManagerReviewPage';
import HiringManagerReviewLoading from '@/features/hiring-manager/components/HiringManagerReviewLoading';

export const metadata: Metadata = { referrer: 'no-referrer' };

type PageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function HiringManagerProjectPage({ params }: PageProps) {
  const { projectId } = await params;

  return (
    <Suspense fallback={<HiringManagerReviewLoading />}>
      <HiringManagerReviewPage projectId={projectId} />
    </Suspense>
  );
}
