import { notFound } from 'next/navigation';
import ProjectDetailsPage from '@/features/company-projects/components/ProjectDetailsPage';
import { projectPreviewData } from '@/features/company-projects/constants/project-preview-data';

type PageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { projectId } = await params;
  if (!projectPreviewData.some((project) => project.id === projectId))
    notFound();
  return <ProjectDetailsPage projectId={projectId} />;
}
