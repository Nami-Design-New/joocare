import { notFound } from 'next/navigation';
import SharedReviewPage from '@/features/company-projects/components/shared-review/SharedReviewPage';
import { projectPreviewData } from '@/features/company-projects/constants/project-preview-data';

type PageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function HiringManagerSharedProjectPage({
  params,
}: PageProps) {
  const { projectId } = await params;
  const project = projectPreviewData.find((item) => item.id === projectId);

  if (!project?.shareLogs.length) notFound();

  return <SharedReviewPage projectId={projectId} experience="hiring-manager" />;
}
