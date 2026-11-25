import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import SharedReviewPage from '@/features/company-projects/components/shared-review/SharedReviewPage';
import { projectPreviewData } from '@/features/company-projects/constants/project-preview-data';
import InviteTokenGuard from '@/features/hiring-manager/components/InviteTokenGuard';

type PageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function HiringManagerProjectPage({ params }: PageProps) {
  const { projectId } = await params;
  const project = projectPreviewData.find((item) => item.id === projectId);

  if (!project?.shareLogs.length) notFound();

  return (
    <Suspense fallback={null}>
      <InviteTokenGuard>
        <SharedReviewPage projectId={projectId} experience="hiring-manager" />
      </InviteTokenGuard>
    </Suspense>
  );
}
