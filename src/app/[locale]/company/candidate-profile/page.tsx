import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import ProjectCandidateProfilePage from '@/features/company-projects/components/candidate-profile/ProjectCandidateProfilePage';
import { projectPreviewData } from '@/features/company-projects/constants/project-preview-data';
import { getProjectCandidateProfile } from '@/features/company-projects/utils/candidate-preview';
import {
  getTalentCandidateProfile,
  TALENT_PROFILE_SOURCE,
} from '@/features/company-talent-database/utils/candidate-profile';
import { getAiTalentMatchHref } from '@/features/jobs/utils';
import Header from '@/shared/components/header/Header';

type PageProps = {
  searchParams: Promise<{
    candidateId?: string;
    projectId?: string;
    source?: string;
    jobId?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { candidateId, projectId, source, jobId } = await searchParams;
  if (!candidateId) notFound();

  const isTalentDatabaseProfile = source === TALENT_PROFILE_SOURCE;
  const hasProject = projectId
    ? projectPreviewData.some((project) => project.id === projectId)
    : false;
  const candidate = isTalentDatabaseProfile
    ? getTalentCandidateProfile(candidateId)
    : hasProject
      ? getProjectCandidateProfile(candidateId)
      : null;

  if (!candidate) notFound();

  const t = isTalentDatabaseProfile
    ? await getTranslations('companyPage.talent-database')
    : null;

  return (
    <main className="min-h-dvh bg-body-bg">
      <Header />
      {isTalentDatabaseProfile && t ? (
        <div className="layout-container pt-6">
          <Link
            href={
              jobId ? getAiTalentMatchHref(jobId) : '/company/talent-database'
            }
            className="text-sm text-primary underline"
          >
            {t(jobId ? 'back-to-ai-match' : 'back-to-database')}
          </Link>
        </div>
      ) : null}
      <ProjectCandidateProfilePage candidate={candidate} />
    </main>
  );
}
