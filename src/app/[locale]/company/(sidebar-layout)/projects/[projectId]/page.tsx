import ProjectDetailsPage from '@/features/company-projects/components/ProjectDetailsPage';

type PageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { projectId } = await params;
  return <ProjectDetailsPage key={projectId} projectId={projectId} />;
}
