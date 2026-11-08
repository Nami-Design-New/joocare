'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CandidateAssessmentModals from '@/features/company-assessments/components/candidate-assessments/CandidateAssessmentModals';
import { useCandidateAssessmentActions } from '@/features/company-assessments/hooks/useCandidateAssessmentActions';
import type { AssessmentCandidateSummary } from '@/features/company-assessments/types/candidate-assessment.types';
import CandidateProjectModals from '@/features/company-projects/components/Modals/CandidateProjectModals';
import { useCandidateProjectActions } from '@/features/company-projects/hooks/useCandidateProjectActions';
import TalentMessageDialog from '@/features/company-talent-database/components/TalentMessageDialog';
import { useRouter } from '@/i18n/navigation';
import { CustomPagination } from '@/shared/components/CustomPagination';
import EmptyDataState from '@/shared/components/EmptyDataState';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { COMPANY_INBOX_PATH, JOB_CANDIDATES_PAGE_SIZE } from '../../constants';
import { usePipelineCandidates } from '../../hooks/usePipelineCandidates';
import type { PipelineCandidate } from '../../types/job-candidates.types';
import { getPipelineFiltersHref } from '../../utils';
import CvFileModal from '@/shared/components/modals/CvFileModal';
import PipelineActiveFilters from './PipelineActiveFilters';
import PipelineCandidatesTable from './PipelineCandidatesTable';
import PipelineToolbar from './PipelineToolbar';
import JobCandidatesTabs from './JobCandidatesTabs';

type PipelineCandidatesTabProps = {
  jobId: number;
};

const toAssessmentCandidate = (
  candidate: PipelineCandidate,
): AssessmentCandidateSummary => ({
  id: candidate.userId,
  name: candidate.name,
  image: candidate.image,
  location: candidate.location,
  email: candidate.email,
});

export default function PipelineCandidatesTab({
  jobId,
}: PipelineCandidatesTabProps) {
  const t = useTranslations('companyPage.candidates');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pipeline = usePipelineCandidates(jobId);
  const projectActions = useCandidateProjectActions();
  const assessmentActions = useCandidateAssessmentActions();
  const pageSize = pipeline.pageSize ?? JOB_CANDIDATES_PAGE_SIZE;

  return (
    <>
      <div className="bg-muted flex flex-col gap-4 rounded-3xl p-3">
        <JobCandidatesTabs jobId={jobId} activeTab="pipeline" />
        <PipelineToolbar
          selectedCount={pipeline.selected.length}
          total={pipeline.total}
          allTotal={pipeline.allTotal}
          activeFiltersCount={pipeline.chips.length}
          filtersHref={getPipelineFiltersHref(jobId, searchParams.toString())}
          onQuickMessage={() => pipeline.setMessageOpen(true)}
        />
        <PipelineActiveFilters
          chips={pipeline.chips}
          labels={pipeline.labels}
          onRemove={pipeline.removeChip}
          onClearAll={pipeline.clearAll}
        />
      </div>

      {pipeline.isLoading ? (
        <div className="bg-card flex flex-col gap-3 rounded-2xl p-3" aria-busy>
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : pipeline.isError ? (
        <div
          role="alert"
          className="bg-card flex flex-col items-center gap-4 rounded-2xl p-10 text-center"
        >
          <p className="text-destructive">{t('pipeline.load-error')}</p>
          <Button variant="outline" onClick={() => pipeline.refetch()}>
            {t('pipeline.retry')}
          </Button>
        </div>
      ) : pipeline.candidates.length ? (
        <>
          <PipelineCandidatesTable
            candidates={pipeline.candidates}
            pageOffset={(pipeline.page - 1) * pageSize}
            selectedIds={pipeline.selectedIds}
            downloadingId={pipeline.downloadingId}
            onToggle={pipeline.toggleCandidate}
            onToggleAll={pipeline.toggleAll}
            isStarred={pipeline.isStarred}
            onToggleStar={pipeline.toggleStar}
            onCreateProject={projectActions.openCreate}
            onLinkProject={projectActions.openLink}
            onMessage={(candidate) =>
              router.push(`${COMPANY_INBOX_PATH}?candidateId=${candidate.userId}`)
            }
            onDownload={pipeline.downloadCv}
            onViewCv={pipeline.setCvCandidate}
            onViewAssessments={(candidate) =>
              assessmentActions.openList(
                toAssessmentCandidate(candidate),
                candidate.assessments,
              )
            }
            onAssignAssessment={(candidate) =>
              assessmentActions.openAssign(toAssessmentCandidate(candidate))
            }
          />
          <CustomPagination
            totalItems={pipeline.total}
            pageSize={pageSize}
            currentPage={pipeline.page}
            onPageChange={pipeline.setPage}
            statusPosition="start"
            className="justify-start"
          />
        </>
      ) : (
        <EmptyDataState
          title={
            pipeline.hasFilters
              ? 'companyPage.candidates.pipeline.no-matches-title'
              : undefined
          }
          description={
            pipeline.hasFilters ? t('pipeline.no-matches-description') : undefined
          }
        />
      )}

      {pipeline.messageOpen && (
        <TalentMessageDialog
          candidates={pipeline.selected}
          onRemove={pipeline.toggleCandidate}
          onClose={() => pipeline.setMessageOpen(false)}
          onSend={pipeline.previewSendMessage}
        />
      )}
      <SuccessModal
        open={pipeline.sentCount > 0}
        onOpenChange={(open) => {
          if (!open) pipeline.setSentCount(0);
        }}
        title={t('pipeline.message-success', { count: pipeline.sentCount })}
        description=""
        className="w-[calc(100%-2rem)] max-w-175 grid-cols-1 rounded-3xl sm:min-w-0 [&_[data-slot=dialog-title]]:text-[28px]"
        visualClassName="aspect-square h-auto w-75 max-w-full"
        visualWrapperClassName="mt-16 mb-2"
      />
      <CvFileModal
        open={!!pipeline.cvCandidate}
        onOpenChange={(open) => {
          if (!open) pipeline.setCvCandidate(null);
        }}
        title={t('cv-modal.title')}
        pdfUrl={pipeline.cvCandidate?.cvUrl}
      />
      <CandidateProjectModals actions={projectActions} />
      <CandidateAssessmentModals actions={assessmentActions} />
    </>
  );
}
