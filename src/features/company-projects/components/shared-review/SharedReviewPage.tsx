'use client';

import { useSharedProjectReview } from '../../hooks/useSharedProjectReview';
import CandidateCvModal from '../Modals/CandidateCvModal';
import DecisionsSubmittedModal from './DecisionsSubmittedModal';
import ReviewCandidatesStep from './ReviewCandidatesStep';
import ScheduleInterviewsStep from './ScheduleInterviewsStep';
import SharedReviewHeader from './SharedReviewHeader';

type SharedReviewPageProps = {
  projectId: string;
  experience?: 'company' | 'hiring-manager';
};

export default function SharedReviewPage({
  projectId,
  experience = 'company',
}: SharedReviewPageProps) {
  const review = useSharedProjectReview(projectId);
  if (!review.project || !review.share) return null;

  return (
    <div className="bg-body-bg min-h-dvh">
      <SharedReviewHeader experience={experience} />

      <main className="mx-auto w-full max-w-360 px-4 pt-10 pb-14 md:px-7 md:pt-14.5 lg:px-13">
        {review.step === 'review' ? (
          <ReviewCandidatesStep
            projectName={review.project.name}
            sharedBy={review.share.sharedBy}
            sharedAt={review.share.date}
            totalCandidates={review.totalCandidates}
            candidates={review.candidates}
            filteredCount={review.filteredCount}
            status={review.status}
            page={review.page}
            pageSize={review.pageSize}
            onStatusChange={review.updateStatus}
            onPageChange={review.setPage}
            onPreviewCv={review.openCv}
            onDownloadCv={review.downloadCandidateCv}
            onDecision={review.toggleDecision}
            onNext={review.goToSchedule}
          />
        ) : (
          <ScheduleInterviewsStep
            projectName={review.project.name}
            candidates={review.shortlistedCandidates}
            onBack={review.backToReview}
            onSubmit={review.submitDecisions}
          />
        )}
      </main>

      {review.cvCandidate ? (
        <CandidateCvModal
          candidate={review.cvCandidate}
          onClose={review.closeCv}
          onDownload={review.downloadCandidateCv}
        />
      ) : null}

      {review.summary ? (
        <DecisionsSubmittedModal
          projectName={review.project.name}
          recruiter={review.share.sharedBy}
          summary={review.summary}
          experience={experience}
        />
      ) : null}
    </div>
  );
}
