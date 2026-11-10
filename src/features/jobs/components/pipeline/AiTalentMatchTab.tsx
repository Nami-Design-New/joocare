'use client';

import { useState } from 'react';
import { CHAT_ROUTES } from '@/features/chat/constants';
import CandidateProjectModals from '@/features/company-projects/components/Modals/CandidateProjectModals';
import { useCandidateProjectActions } from '@/features/company-projects/hooks/useCandidateProjectActions';
import TalentCandidatesTable from '@/features/company-talent-database/components/TalentCandidatesTable';
import type { TalentCandidate } from '@/features/company-talent-database/types/talent-database.types';
import { getTalentProfileHref } from '@/features/company-talent-database/utils/candidate-profile';
import { useRouter } from '@/i18n/navigation';
import { CustomPagination } from '@/shared/components/CustomPagination';
import EmptyDataState from '@/shared/components/EmptyDataState';
import CvFileModal from '@/shared/components/modals/CvFileModal';
import { AI_TALENT_MATCH_PAGE_SIZE } from '../../constants';
import { useAiTalentMatchPreview } from '../../hooks/useAiTalentMatchPreview';
import AiTalentMatchFilters from './AiTalentMatchFilters';
import JobCandidatesTabs from './JobCandidatesTabs';

type AiTalentMatchTabProps = {
  jobId: number;
};

export default function AiTalentMatchTab({ jobId }: AiTalentMatchTabProps) {
  const router = useRouter();
  const aiMatch = useAiTalentMatchPreview();
  const projectActions = useCandidateProjectActions();
  const [cvCandidate, setCvCandidate] = useState<TalentCandidate | null>(null);

  return (
    <>
      <div className="bg-muted flex flex-col gap-4 rounded-3xl p-3">
        <JobCandidatesTabs jobId={jobId} activeTab="ai-match" />
        <AiTalentMatchFilters aiMatch={aiMatch} />
      </div>
      {aiMatch.candidates.length ? (
        <>
          <TalentCandidatesTable
            candidates={aiMatch.candidates}
            pageOffset={(aiMatch.page - 1) * AI_TALENT_MATCH_PAGE_SIZE}
            getProfileHref={(candidate) =>
              getTalentProfileHref(candidate.id, String(jobId))
            }
            onViewCv={setCvCandidate}
            onMessage={(candidate) =>
              router.push({
                pathname: CHAT_ROUTES.company,
                query: { conversation: candidate.id },
              })
            }
            onCreateProject={projectActions.openCreate}
            onLinkProject={projectActions.openLink}
          />
          <CustomPagination
            totalItems={aiMatch.total}
            pageSize={AI_TALENT_MATCH_PAGE_SIZE}
            currentPage={aiMatch.page}
            onPageChange={aiMatch.setPage}
            statusPosition="start"
            className="justify-start"
          />
        </>
      ) : (
        <EmptyDataState title="companyPage.candidates.pipeline.no-matches-title" />
      )}
      <CandidateProjectModals actions={projectActions} />
      <CvFileModal
        open={!!cvCandidate}
        onOpenChange={(open) => {
          if (!open) setCvCandidate(null);
        }}
        title={cvCandidate?.name ?? ''}
        pdfUrl={cvCandidate?.cv}
      />
    </>
  );
}
