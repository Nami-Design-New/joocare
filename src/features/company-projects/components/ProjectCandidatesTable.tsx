'use client';

import { CalendarDays, Video } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import DataTable, {
  type DataTableColumn,
} from '@/shared/components/common/DataTable';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import type {
  CandidateAction,
  ProjectCandidate,
} from '../types/company-projects.types';

type ProjectCandidatesTableProps = {
  candidates: ProjectCandidate[];
  rowOffset: number;
  direction: 'ltr' | 'rtl';
  onAction: (action: NonNullable<CandidateAction>) => void;
  onViewNote: (candidateId: string) => void;
};

function getStatusClass(status: ProjectCandidate['status']) {
  if (status === 'Shortlist') return 'bg-success/10 text-success';
  if (status === 'Under review') return 'bg-warning/20 text-warning-foreground';
  return 'bg-destructive/10 text-destructive';
}

function getAssessmentClass(assessment: ProjectCandidate['assessment']) {
  if (assessment === 'Passed') return 'text-success';
  if (assessment === 'Failed') return 'text-destructive';
  return 'text-muted-foreground';
}

function getAssessmentLabelKey(assessment: ProjectCandidate['assessment']) {
  return {
    Passed: 'passed',
    Failed: 'failed',
    'Not assigned': 'not-assigned',
  }[assessment];
}

function CandidateIdentity({
  candidate,
  onView,
  onViewNote,
}: {
  candidate: ProjectCandidate;
  onView: () => void;
  onViewNote: () => void;
}) {
  const t = useTranslations('companyPage.projects');
  const statusKey = {
    Rejected: 'rejected',
    Shortlist: 'shortlist',
    'Under review': 'under-review',
  }[candidate.status];

  return (
    <div className="flex min-w-52 items-start gap-3 text-start">
      <Image
        src="/assets/company-projects/candidate-avatar.png"
        alt=""
        width={35}
        height={35}
        className="size-[35px] shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0">
        <button
          type="button"
          onClick={onView}
          className="text-foreground block max-w-full truncate font-medium underline underline-offset-2"
        >
          {candidate.name}
        </button>
        <span
          className={cn(
            'mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium',
            getStatusClass(candidate.status),
          )}
        >
          {t(statusKey)}
        </span>
        {candidate.interview && (
          <div className="text-muted-foreground mt-2 space-y-1 text-[11px] leading-4">
            <p className="flex items-center gap-1">
              <CalendarDays className="text-primary size-3" />
              {candidate.interview}
            </p>
            <p className="flex items-center gap-1">
              <Video className="text-primary size-3" />
              {candidate.interviewType}
            </p>
            <button
              type="button"
              onClick={onViewNote}
              className="text-primary font-medium underline underline-offset-2"
            >
              {t('view-note')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AssessmentCell({
  candidate,
  onShareAssessment,
}: {
  candidate: ProjectCandidate;
  onShareAssessment: () => void;
}) {
  const t = useTranslations('companyPage.projects');

  if (candidate.score !== undefined) {
    return (
      <div className="flex min-w-28 flex-col items-start gap-1 text-start">
        <span
          className={cn(
            'text-xs font-semibold',
            getAssessmentClass(candidate.assessment),
          )}
        >
          {t(getAssessmentLabelKey(candidate.assessment))}
          <strong className="text-foreground ml-2 text-base">
            {candidate.score}%
          </strong>
        </span>
        <Link
          href="/company/assessments/company-1/company-1-1/external-invitations/1"
          className="text-primary text-xs font-medium underline underline-offset-2"
        >
          {t('view-result')}
        </Link>
      </div>
    );
  }

  if (candidate.assessment === 'Not assigned') {
    return (
      <button
        type="button"
        onClick={onShareAssessment}
        className="text-primary text-xs font-semibold whitespace-nowrap underline underline-offset-2"
      >
        + {t('share-assessment')}
      </button>
    );
  }

  return (
    <span
      className={cn(
        'text-xs font-semibold',
        getAssessmentClass(candidate.assessment),
      )}
    >
      {t(getAssessmentLabelKey(candidate.assessment))}
    </span>
  );
}

function CandidateActions({
  candidate,
  onAction,
}: {
  candidate: ProjectCandidate;
  onAction: ProjectCandidatesTableProps['onAction'];
}) {
  const t = useTranslations('companyPage.projects');
  const actions = [
    {
      type: 'share' as const,
      label: t('share-candidate'),
      icon: (
        <Image
          src="/assets/company-projects/candidate-share.svg"
          alt=""
          width={14}
          height={14}
        />
      ),
      variant: 'default' as const,
    },
    {
      type: 'cv' as const,
      label: t('preview-cv'),
      icon: (
        <Image
          src="/assets/company-projects/candidate-pdf.svg"
          alt=""
          width={14}
          height={14}
        />
      ),
      variant: 'secondary' as const,
    },
    {
      type: 'profile' as const,
      label: t('view-candidate'),
      icon: (
        <Image
          src="/assets/company-projects/candidate-view.svg"
          alt=""
          width={14}
          height={14}
        />
      ),
      variant: 'outline' as const,
    },
    {
      type: 'remove' as const,
      label: t('remove-candidate'),
      icon: (
        <Image
          src="/assets/company-projects/candidate-delete.svg"
          alt=""
          width={16}
          height={16}
        />
      ),
      variant: 'destructive' as const,
    },
  ];

  return (
    <div className="flex items-center justify-center gap-1">
      {actions.map((action) => (
        <Button
          key={action.type}
          type="button"
          variant={action.variant}
          size="default"
          aria-label={action.label}
          onClick={() =>
            onAction({ type: action.type, candidateId: candidate.id })
          }
          className={cn(
            'h-[30px] w-[45.25px] rounded-full border-0 px-0 py-0',
            action.type === 'profile' && 'border-secondary bg-card border',
            action.type === 'remove' &&
              'bg-destructive/10 text-destructive hover:bg-destructive/20',
          )}
        >
          {action.icon}
        </Button>
      ))}
    </div>
  );
}

export default function ProjectCandidatesTable({
  candidates,
  rowOffset,
  direction,
  onAction,
  onViewNote,
}: ProjectCandidatesTableProps) {
  const t = useTranslations('companyPage.projects');
  const columns: DataTableColumn<ProjectCandidate>[] = [
    {
      id: 'number',
      header: '#',
      headerClassName: 'w-12 text-start',
      cellClassName: 'w-12 text-start font-medium',
      renderCell: (_candidate, index) => `#${rowOffset + index + 1}`,
    },
    {
      id: 'candidate',
      header: t('candidate'),
      headerClassName: 'min-w-60 text-start',
      cellClassName: 'text-start',
      renderCell: (candidate) => (
        <CandidateIdentity
          candidate={candidate}
          onView={() =>
            onAction({ type: 'profile', candidateId: candidate.id })
          }
          onViewNote={() => onViewNote(candidate.id)}
        />
      ),
    },
    {
      id: 'nationality',
      header: t('nationality'),
      headerClassName: 'min-w-28 text-start',
      cellClassName: 'text-start',
      renderCell: (candidate) => candidate.nationality,
    },
    {
      id: 'email',
      header: t('email'),
      headerClassName: 'min-w-52 text-start',
      cellClassName: 'max-w-56 text-start',
      renderCell: (candidate) => (
        <span className="block truncate">{candidate.email}</span>
      ),
    },
    {
      id: 'phone',
      header: t('phone'),
      headerClassName: 'min-w-36 text-start',
      cellClassName: 'min-w-36 text-start whitespace-nowrap',
      renderCell: (candidate) => <span dir="ltr">{candidate.phone}</span>,
    },
    {
      id: 'assessment',
      header: t('assessment'),
      headerClassName: 'min-w-36 text-start',
      cellClassName: 'text-start',
      renderCell: (candidate) => (
        <AssessmentCell
          candidate={candidate}
          onShareAssessment={() =>
            onAction({ type: 'share', candidateId: candidate.id })
          }
        />
      ),
    },
    {
      id: 'actions',
      header: t('actions'),
      headerClassName: 'min-w-40 text-center',
      cellClassName: 'min-w-40 text-center',
      renderCell: (candidate) => (
        <CandidateActions candidate={candidate} onAction={onAction} />
      ),
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={candidates}
        getRowKey={(candidate) => candidate.id}
        dir={direction}
        ariaLabel={t('candidate-table-title')}
        containerClassName="rounded-2xl border border-border bg-card"
        className="min-w-[1080px] [&_td]:!px-4 [&_td]:!py-4 [&_td]:!text-sm [&_th]:!py-4 [&_th]:!text-sm"
        headerRowClassName="bg-muted/70"
        rowClassName="border-t border-border bg-body-bg/70 align-middle hover:bg-primary/5"
      />
      {!candidates.length && (
        <p
          role="status"
          className="bg-card text-muted-foreground mt-4 rounded-xl px-4 py-8 text-center text-sm"
        >
          {t('no-candidates')}
        </p>
      )}
    </div>
  );
}
