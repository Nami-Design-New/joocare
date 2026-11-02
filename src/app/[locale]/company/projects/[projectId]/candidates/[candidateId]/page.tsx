import { notFound } from 'next/navigation';
import ProjectCandidateProfilePage from '@/features/company-projects/components/candidate-profile/ProjectCandidateProfilePage';
import { projectPreviewData } from '@/features/company-projects/constants/project-preview-data';
import { getProjectCandidateProfile } from '@/features/company-projects/utils/candidate-preview';
import Header from '@/shared/components/header/Header';

type PageProps = {
  params: Promise<{ projectId: string; candidateId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { projectId, candidateId } = await params;
  const hasProject = projectPreviewData.some(
    (project) => project.id === projectId,
  );
  const candidate = getProjectCandidateProfile(candidateId);
  if (!hasProject || !candidate) notFound();

  return (
    <main className="bg-body-bg min-h-dvh">
      <Header />
      <ProjectCandidateProfilePage candidate={candidate} />
    </main>
  );
}
