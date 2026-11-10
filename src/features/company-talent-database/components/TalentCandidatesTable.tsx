'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import CandidateNameCell from '@/shared/components/candidates/CandidateNameCell';
import CandidateRowActions from '@/shared/components/candidates/CandidateRowActions';
import CandidateScoreCircle from '@/shared/components/candidates/CandidateScoreCircle';
import DataTable, {
  type DataTableColumn,
} from '@/shared/components/common/DataTable';
import { Checkbox } from '@/shared/components/ui/checkbox';
import type { TalentCandidate } from '../types/talent-database.types';

type TalentCandidateSelection = {
  selectedIds: string[];
  onToggle: (id: string) => void;
  onToggleAll: () => void;
};

type TalentCandidatesTableProps = {
  candidates: TalentCandidate[];
  pageOffset: number;
  // Omit to hide the checkbox column (e.g. AI Talent Match).
  selection?: TalentCandidateSelection;
  getProfileHref: (candidate: TalentCandidate) => string;
  onMessage: (candidate: TalentCandidate) => void;
  onViewCv?: (candidate: TalentCandidate) => void;
  onCreateProject: (candidate: TalentCandidate) => void;
  onLinkProject: (candidate: TalentCandidate) => void;
};

export default function TalentCandidatesTable({
  candidates,
  pageOffset,
  selection,
  getProfileHref,
  onMessage,
  onViewCv,
  onCreateProject,
  onLinkProject,
}: TalentCandidatesTableProps) {
  const t = useTranslations('companyPage.talent-database');
  const [favorites, setFavorites] = useState<string[]>([]);
  const toggleFavorite = (id: string) =>
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

  const numberColumn: DataTableColumn<TalentCandidate> = selection
    ? getSelectionColumn(candidates, pageOffset, selection, {
        selectAll: t('select-all'),
        selectCandidate: (name) => t('select-candidate', { name }),
      })
    : {
        id: 'number',
        header: '#',
        headerClassName: 'w-[6%] text-start',
        cellClassName: 'w-[6%] px-4 text-start',
        renderCell: (_candidate, index) => `#${pageOffset + index + 1}`,
      };

  const columns: DataTableColumn<TalentCandidate>[] = [
    numberColumn,
    {
      id: 'name',
      header: t('name'),
      headerClassName: 'w-[25%] text-start',
      cellClassName: 'w-[25%] text-start',
      renderCell: (candidate) => (
        <CandidateNameCell
          name={candidate.name}
          image={candidate.image}
          href={getProfileHref(candidate)}
          isStarred={favorites.includes(candidate.id)}
          onToggleStar={() => toggleFavorite(candidate.id)}
          onCreateProject={() => onCreateProject(candidate)}
          onLinkProject={() => onLinkProject(candidate)}
        />
      ),
    },
    {
      id: 'nationality',
      header: t('fields.nationality'),
      headerClassName: 'w-[11%]',
      cellClassName: 'w-[11%]',
      renderCell: (candidate) =>
        t(`options.${candidate.attributes.nationality}`),
    },
    {
      id: 'email',
      header: t('email'),
      headerClassName: 'w-[14%]',
      cellClassName: 'w-[14%]',
      renderCell: (candidate) => (
        <bdi className="block max-w-40 truncate" title={candidate.email}>
          {candidate.email}
        </bdi>
      ),
    },
    {
      id: 'phone',
      header: t('phone'),
      headerClassName: 'w-[13%]',
      cellClassName: 'w-[13%]',
      renderCell: (candidate) => (
        <bdi className="whitespace-nowrap">{candidate.phone}</bdi>
      ),
    },
    {
      id: 'score',
      header: t('ai-score'),
      headerClassName: 'w-[10%]',
      cellClassName: 'w-[10%]',
      renderCell: (candidate) => (
        <CandidateScoreCircle score={candidate.score} />
      ),
    },
    {
      id: 'cv',
      header: t('cv'),
      headerClassName: 'w-[18%]',
      cellClassName: 'w-[18%]',
      renderCell: (candidate) => (
        <CandidateRowActions
          name={candidate.name}
          onMessage={() => onMessage(candidate)}
          downloadHref={candidate.cv}
          viewHref={onViewCv ? undefined : getProfileHref(candidate)}
          onView={onViewCv ? () => onViewCv(candidate) : undefined}
          viewKind={onViewCv ? 'cv' : 'profile'}
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
        ariaLabel={t('results-table')}
        className="min-w-257 table-fixed"
        headerRowClassName="bg-primary hover:bg-primary [&_th]:text-primary-foreground"
        rowClassName="bg-body-bg h-[92px] border-border"
      />
    </div>
  );
}

function getSelectionColumn(
  candidates: TalentCandidate[],
  pageOffset: number,
  { selectedIds, onToggle, onToggleAll }: TalentCandidateSelection,
  labels: { selectAll: string; selectCandidate: (name: string) => string },
): DataTableColumn<TalentCandidate> {
  const selectedOnPage = candidates.filter((candidate) =>
    selectedIds.includes(candidate.id),
  ).length;

  return {
    id: 'selection',
    header: (
      <div className="flex items-center gap-2">
        <Checkbox
          aria-label={labels.selectAll}
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
    headerClassName: 'w-[9%] text-start',
    cellClassName: 'w-[9%] px-4 text-start',
    renderCell: (candidate, index) => (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={selectedIds.includes(candidate.id)}
          onCheckedChange={() => onToggle(candidate.id)}
          aria-label={labels.selectCandidate(candidate.name)}
          className="size-6 rounded-[3px]"
        />
        <span>{pageOffset + index + 1}</span>
      </div>
    ),
  };
}
