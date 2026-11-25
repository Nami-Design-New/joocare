'use client';

import { useTranslations } from 'next-intl';
import HttpStatusState from '@/shared/components/HttpStatusState';
import RouteErrorFallback from '@/shared/components/RouteErrorFallback';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { getHttpStatusCode } from '@/shared/lib/http-error';
import { useGetCandidateProfile } from '../../hooks/useGetCandidateProfile';
import ProjectCandidateProfilePage from './ProjectCandidateProfilePage';

const HTTP_NOT_FOUND = 404;

type CandidateProfileViewProps = {
  userId: string;
};

// Real candidate profile (loads `users/{id}/profile`) with its page states.
export default function CandidateProfileView({
  userId,
}: CandidateProfileViewProps) {
  const t = useTranslations('companyPage.projects.candidate-profile');
  const query = useGetCandidateProfile(userId);

  if (query.profile) {
    return <ProjectCandidateProfilePage candidate={query.profile} />;
  }

  if (query.isError && getHttpStatusCode(query.error) === HTTP_NOT_FOUND) {
    return (
      <HttpStatusState
        statusCode={HTTP_NOT_FOUND}
        title={t('not-found')}
        description={t('not-found-description')}
        primaryHref="/company/projects"
        primaryLabel={t('back-to-projects')}
      />
    );
  }

  if (query.isError) {
    return (
      <RouteErrorFallback
        error={query.error}
        reset={() => void query.refetch()}
        title={t('load-error')}
        description={t('load-error-description')}
        retryLabel={t('retry')}
      />
    );
  }

  return (
    <div
      aria-busy="true"
      className="layout-container grid grid-cols-1 items-start gap-5 py-5 sm:gap-8 sm:py-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:py-12.5"
    >
      <Skeleton className="h-150 rounded-2xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
      </div>
    </div>
  );
}
