'use client';

import { UserRoundPlus } from 'lucide-react';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import CandidateAssessmentCell from '@/features/company-assessments/components/candidate-assessments/CandidateAssessmentCell';
import { getTalentProfileHref } from '@/features/company-talent-database/utils/candidate-profile';
import CandidateNameCell from '@/shared/components/candidates/CandidateNameCell';
import CandidateRowActions from '@/shared/components/candidates/CandidateRowActions';
import CandidateScoreCircle from '@/shared/components/candidates/CandidateScoreCircle';
import DataTable, {
  type DataTableColumn,
} from '@/shared/components/common/DataTable';
import { Checkbox } from '@/shared/components/ui/checkbox';
import type { PipelineCandidate } from '../../types/job-candidates.types';

export type PipelineRowHandlers = {
  isStarred: (candidate: PipelineCandidate) => boolean;
  onToggleStar: (candidate: PipelineCandidate) => void;
  onCreateProject: (candidate: PipelineCandidate) => void;
  onLinkProject: (candidate: PipelineCandidate) => void;
  onMessage: (candidate: PipelineCandidate) => void;
  onDownload: (candidate: PipelineCandidate) => void;
  onViewCv: (candidate: PipelineCandidate) => void;
  onViewAssessments: (candidate: PipelineCandidate) => void;
  onAssignAssessment: (candidate: PipelineCandidate) => void;
};

type PipelineCandidatesTableProps = PipelineRowHandlers & {
  candidates: PipelineCandidate[];
  pageOffset: number;
  selectedIds: string[];
  downloadingId?: string;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
};

export default function PipelineCandidatesTable({
  candidates,
  pageOffset,
  selectedIds,
  downloadingId,
  onToggle,
  onToggleAll,
  ...handlers
}: PipelineCandidatesTableProps) {
  const t = useTranslations('companyPage.candidates.pipeline');
  const format = useFormatter();
  const direction = useLocale() === 'ar' ? 'rtl' : 'ltr';
  const selectedOnPage = candidates.filter((candidate) =>
    selectedIds.includes(candidate.id),
  ).length;

  const columns: DataTableColumn<PipelineCandidate>[] = [
    {
      id: 'selection',
      header: (
        <div className="flex items-center gap-2">
          <Checkbox
            aria-label={t('select-all')}
            checked={
              selectedOnPage === candidates.length && candidates.length > 0
                ? true
                : selectedOnPage
                  ? 'indeterminate'
                  : false
            }
            onCheckedChange={onToggleAll}
            className="border-primary-foreground bg-card size-6 rounded-[3px]"
          />
          <span>#</span>
        </div>
      ),
      headerClassName: 'w-[8%] text-start',
      cellClassName: 'w-[8%] px-4 text-start',
      renderCell: (candidate, index) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedIds.includes(candidate.id)}
            onCheckedChange={() => onToggle(candidate.id)}
            aria-label={t('select-candidate', { name: candidate.name })}
            className="size-6 rounded-[3px]"
          />
          <span>#{pageOffset + index + 1}</span>
        </div>
      ),
    },
    {
      id: 'name',
      header: t('columns.name'),
      headerClassName: 'w-[24%] text-start',
      cellClassName: 'w-[24%] text-start',
      renderCell: (candidate) => (
        <CandidateNameCell
          name={candidate.name}
          image={candidate.image}
          href={getTalentProfileHref('talent-5')}
          isStarred={handlers.isStarred(candidate)}
          onToggleStar={() => handlers.onToggleStar(candidate)}
          onCreateProject={() => handlers.onCreateProject(candidate)}
          onLinkProject={() => handlers.onLinkProject(candidate)}
        />
      ),
    },
    {
      id: 'email',
      header: t('columns.email'),
      headerClassName: 'w-[15%]',
      cellClassName: 'w-[15%]',
      renderCell: (candidate) => (
        <div className="flex flex-col items-center gap-1">
          <bdi className="block max-w-44 truncate" title={candidate.email}>
            {candidate.email}
          </bdi>
          {candidate.addedBy && (
            <span className="bg-primary-bg text-primary flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
              <UserRoundPlus aria-hidden className="size-3" />
              {t('added-by', { name: candidate.addedBy })}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'applied-on',
      header: t('columns.applied-on'),
      headerClassName: 'w-[11%]',
      cellClassName: 'w-[11%]',
      renderCell: (candidate) => {
        const date = new Date(candidate.appliedAt);
        return (
          <div className="flex flex-col text-sm">
            <span>
              {format.dateTime(date, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <span className="text-muted-foreground text-xs">
              {format.dateTime(date, { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      },
    },
    {
      id: 'score',
      header: t('columns.ai-match'),
      headerClassName: 'w-[11%]',
      cellClassName: 'w-[11%]',
      renderCell: (candidate) => (
        <CandidateScoreCircle score={candidate.aiMatchScore} />
      ),
    },
    {
      id: 'cv',
      header: t('columns.cv-message'),
      headerClassName: 'w-[17%]',
      cellClassName: 'w-[17%]',
      renderCell: (candidate) => (
        <CandidateRowActions
          name={candidate.name}
          onMessage={() => handlers.onMessage(candidate)}
          onDownload={
            candidate.cvUrl ? () => handlers.onDownload(candidate) : undefined
          }
          isDownloading={downloadingId === candidate.id}
          onView={
            candidate.cvUrl ? () => handlers.onViewCv(candidate) : undefined
          }
        />
      ),
    },
    {
      id: 'assessment',
      header: t('columns.assessment'),
      headerClassName: 'w-[14%]',
      cellClassName: 'w-[14%]',
      renderCell: (candidate) => (
        <CandidateAssessmentCell
          candidateId={candidate.userId}
          assessments={candidate.assessments}
          onViewAll={() => handlers.onViewAssessments(candidate)}
          onAssign={() => handlers.onAssignAssessment(candidate)}
        />
      ),
    },
  ];

  return (
    <div className="bg-card rounded-2xl p-3">
      <DataTable
        columns={columns}
        data={candidates}
        getRowKey={(candidate) => candidate.id}
        dir={direction}
        ariaLabel={t('table-label')}
        className="min-w-275 table-fixed"
        headerRowClassName="bg-primary hover:bg-primary [&_th]:text-primary-foreground"
        rowClassName="bg-body-bg h-23 border-border"
      />
    </div>
  );
}
