import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import CandidateProfileView from '@/features/company-projects/components/candidate-profile/CandidateProfileView';
import ProjectCandidateProfilePage from '@/features/company-projects/components/candidate-profile/ProjectCandidateProfilePage';
import {
  getTalentCandidateProfile,
  TALENT_PROFILE_SOURCE,
} from '@/features/company-talent-database/utils/candidate-profile';
import { getAiTalentMatchHref } from '@/features/jobs/utils';
import Header from '@/shared/components/header/Header';

type PageProps = {
  searchParams: Promise<{
    candidateId?: string;
    source?: string;
    jobId?: string;
  }>;
};

// `candidateId` is the user id. Talent database rows are still preview data.
export default async function Page({ searchParams }: PageProps) {
  const { candidateId, source, jobId } = await searchParams;
  if (!candidateId) notFound();

  if (source !== TALENT_PROFILE_SOURCE) {
    return (
      <main className="min-h-dvh bg-body-bg">
        <Header />
        <CandidateProfileView key={candidateId} userId={candidateId} />
      </main>
    );
  }

  const candidate = getTalentCandidateProfile(candidateId);
  if (!candidate) notFound();
  const t = await getTranslations('companyPage.talent-database');

  return (
    <main className="min-h-dvh bg-body-bg">
      <Header />
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
      <ProjectCandidateProfilePage candidate={candidate} />
    </main>
  );
}
