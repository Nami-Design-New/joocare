'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';
import DecisionsSubmittedModal from '@/features/company-projects/components/shared-review/DecisionsSubmittedModal';
import ReviewCandidatesStep from '@/features/company-projects/components/shared-review/ReviewCandidatesStep';
import ScheduleInterviewsStep from '@/features/company-projects/components/shared-review/ScheduleInterviewsStep';
import SharedReviewHeader from '@/features/company-projects/components/shared-review/SharedReviewHeader';
import {
  ALL_STATUSES_VALUE,
  SHARED_REVIEW_PAGE_SIZE,
} from '@/features/company-projects/constants/shared-review-options';
import type { SharedReviewCandidate } from '@/features/company-projects/types/shared-review.types';
import { getCandidateCvFileName } from '@/features/company-projects/utils/candidate-preview';
import HttpStatusState from '@/shared/components/HttpStatusState';
import CvFileModal from '@/shared/components/modals/CvFileModal';
import { Button } from '@/shared/components/ui/button';
import { downloadFile } from '@/shared/lib/download-file';
import { getHttpStatusCode } from '@/shared/lib/http-error';
import { useHiringManagerReview } from '../hooks/useHiringManagerReview';
import { useInviteToken } from '../hooks/useInviteToken';
import { useLogoutHiringManager } from '../hooks/useLogoutHiringManager';
import {
  clearInviteToken,
  getStoredInviteToken,
} from '../lib/invite-token-storage';
import HiringManagerReviewLoading from './HiringManagerReviewLoading';
import type { HiringManagerReviewAccess } from '../types/hiring-manager-review.types';

type HiringManagerReviewPageProps = { projectId: string };

type ReviewRequestErrorProps = {
  message: string;
  isRetrying: boolean;
  onRetry: () => void;
  onBack?: () => void;
};

function ReviewRequestError({
  message,
  isRetrying,
  onRetry,
  onBack,
}: ReviewRequestErrorProps) {
  const t = useTranslations('companyPage.projects.shared-review');
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-xl bg-card p-4 text-center">
      <p role="alert" className="text-destructive">
        {message}
      </p>
      <div className="flex gap-3">
        {onBack ? (
          <Button variant="ghost" onClick={onBack}>
            {t('back')}
          </Button>
        ) : null}
        <Button variant="outline" disabled={isRetrying} onClick={onRetry}>
          {t('retry-review')}
        </Button>
      </div>
    </div>
  );
}

function InvalidInviteState() {
  const t = useTranslations('companyPage.projects.shared-review');
  return (
    <HttpStatusState
      statusCode={401}
      title={t('invalid-invite-title')}
      description={t('invalid-invite-description')}
      primaryLabel={t('back-home')}
    />
  );
}

function HiringManagerReview({
  onLogout,
  isLoggingOut,
  ...access
}: HiringManagerReviewAccess & {
  onLogout: () => void;
  isLoggingOut: boolean;
}) {
  const t = useTranslations('companyPage.projects.shared-review');
  const locale = useLocale();
  const review = useHiringManagerReview(access);
  const { token } = access;
  const {
    projectQuery,
    candidatesQuery,
    shortlistQuery,
    summaryQuery,
    isUnauthorized,
  } = review;
  const project = projectQuery.data;
  const candidatePage = candidatesQuery.data;

  useEffect(() => {
    if (isUnauthorized && getStoredInviteToken() === token) clearInviteToken();
  }, [isUnauthorized, token]);

  function downloadCandidateCv(candidate: SharedReviewCandidate) {
    if (!candidate.cv) return;

    const params = new URLSearchParams({
      url: candidate.cv,
      filename: getCandidateCvFileName(candidate),
      locale,
    });
    downloadFile(
      `/api/download-cv?${params}`,
      getCandidateCvFileName(candidate),
    );
  }

  if (isUnauthorized) return <InvalidInviteState />;
  if (projectQuery.isPending) return <HiringManagerReviewLoading />;
  if (projectQuery.isError || !project) {
    return (
      <HttpStatusState
        statusCode={getHttpStatusCode(projectQuery.error) ?? 500}
        title={t('review-error-title')}
        description={t('review-error-description')}
        primaryLabel={t('back-home')}
      />
    );
  }

  if (review.showSummary) {
    if (summaryQuery.isPending) return <HiringManagerReviewLoading />;
    if (summaryQuery.isError) {
      return (
        <ReviewRequestError
          message={t('summary-load-error')}
          isRetrying={summaryQuery.isFetching}
          onRetry={() => void summaryQuery.refetch()}
        />
      );
    }

    return (
      <DecisionsSubmittedModal
        projectName={summaryQuery.data.projectName}
        recruiter={summaryQuery.data.recruiter}
        summary={summaryQuery.data}
        onLogout={onLogout}
        isLoggingOut={isLoggingOut}
        showNotificationNotice={false}
      />
    );
  }

  if (review.step === 'schedule') {
    if (shortlistQuery.isPending || shortlistQuery.isFetching)
      return <HiringManagerReviewLoading />;
    if (shortlistQuery.isError) {
      return (
        <ReviewRequestError
          message={t('shortlist-load-error')}
          isRetrying={shortlistQuery.isFetching}
          onRetry={() => void shortlistQuery.refetch()}
          onBack={() => review.goToStep('review')}
        />
      );
    }

    return (
      <ScheduleInterviewsStep
        projectName={project.name}
        candidates={shortlistQuery.data}
        onBack={() => review.goToStep('review')}
        onSubmit={review.submitInterviews}
        isSubmitting={review.isScheduling}
      />
    );
  }

  const total = candidatePage?.total;
  const description = t(
    total === undefined
      ? 'invite-shared-description'
      : review.status === ALL_STATUSES_VALUE
        ? 'invite-candidate-count'
        : 'invite-filtered-count',
    { name: project.sharedBy, date: project.sharedAt, count: total ?? 0 },
  );

  return (
    <>
      <ReviewCandidatesStep
        projectName={project.name}
        description={description}
        candidates={candidatePage?.candidates ?? []}
        candidateState={
          candidatesQuery.isPending ? (
            <HiringManagerReviewLoading />
          ) : candidatesQuery.isError ? (
            <ReviewRequestError
              message={t('candidates-error')}
              isRetrying={candidatesQuery.isFetching}
              onRetry={() => void candidatesQuery.refetch()}
            />
          ) : undefined
        }
        filteredCount={candidatesQuery.isError ? 0 : (total ?? 0)}
        status={review.status}
        page={candidatePage?.page ?? review.page}
        pageSize={candidatePage?.perPage ?? SHARED_REVIEW_PAGE_SIZE}
        onStatusChange={review.changeStatus}
        onPageChange={review.setPage}
        onPreviewCv={review.setCvCandidate}
        onDownloadCv={downloadCandidateCv}
        onDecision={review.toggleDecision}
        onNext={() => review.goToStep('schedule')}
        isSavingDecision={review.isSavingDecision}
      />

      {review.cvCandidate ? (
        <CvFileModal
          open
          onOpenChange={(open) => !open && review.setCvCandidate(null)}
          title={review.cvCandidate.name}
          pdfUrl={review.cvCandidate.cv}
          onDownload={() => {
            if (review.cvCandidate) downloadCandidateCv(review.cvCandidate);
          }}
        />
      ) : null}
    </>
  );
}

export default function HiringManagerReviewPage({
  projectId,
}: HiringManagerReviewPageProps) {
  const { session, isChecking } = useInviteToken();
  const { logout, isLoggingOut, isRedirecting } = useLogoutHiringManager();

  return (
    <div className="min-h-dvh bg-body-bg">
      <SharedReviewHeader onLogout={logout} isLoggingOut={isLoggingOut} />
      <main className="layout-content mx-auto px-4 pt-6 pb-8 sm:pt-10 sm:pb-14 md:px-7 md:pt-14 lg:px-13">
        {isChecking || isRedirecting ? (
          <HiringManagerReviewLoading />
        ) : session ? (
          <HiringManagerReview
            key={`${projectId}:${session.queryScope}`}
            projectId={projectId}
            onLogout={logout}
            isLoggingOut={isLoggingOut}
            {...session}
          />
        ) : (
          <InvalidInviteState />
        )}
      </main>
    </div>
  );
}
