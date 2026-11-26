'use client';

import { CalendarDays, MapPin, Video } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link, useRouter } from '@/i18n/navigation';
import { getCompanyChatHref } from '@/features/chat/utils/company-chat-href';
import DataTable, {
  type DataTableColumn,
} from '@/shared/components/common/DataTable';
import { Button } from '@/shared/components/ui/button';
import { getAssessmentResultHref } from '@/features/company-assessments/utils/candidate-assessments';
import { cn } from '@/shared/lib/utils';
import { getCandidateProfileHref } from '../utils/candidate-profile-href';
import type {
  CandidateAction,
  ProjectCandidate,
} from '../types/company-projects.types';
import {
  CANDIDATE_AVATAR_FALLBACK,
  MISSING_API_VALUE,
} from '../constants/project-queries';

type ProjectCandidatesTableProps = {
  candidates: ProjectCandidate[];
  rowOffset: number;
  direction: 'ltr' | 'rtl';
  onAction: (action: NonNullable<CandidateAction>) => void;
  onViewNote: (candidateId: string) => void;
  onDownloadCv: (candidate: ProjectCandidate) => void;
  onShareAssessment: (candidate: ProjectCandidate) => void;
  onViewAssessments: (candidate: ProjectCandidate) => void;
  /** True when the list is filtered (changes the empty message). */
  isFiltered: boolean;
};

function getStatusClass(status: NonNullable<ProjectCandidate['status']>) {
  if (status === 'Shortlist') return 'bg-success/10 text-success';
  if (status === 'Under review') return 'bg-warning/20 text-warning-foreground';
  return 'bg-destructive/10 text-destructive';
}

function getAssessmentClass(
  assessment: NonNullable<ProjectCandidate['assessment']>,
) {
  if (assessment === 'Passed') return 'bg-success/10 text-success';
  if (assessment === 'Failed') return 'bg-destructive/10 text-destructive';
  if (assessment === 'Pending') return 'bg-warning/15 text-warning-strong';
  return 'bg-muted text-muted-foreground';
}

function getAssessmentLabelKey(
  assessment: NonNullable<ProjectCandidate['assessment']>,
) {
  return {
    Passed: 'passed',
    Failed: 'failed',
    Pending: 'assessment-pending',
    Absent: 'assessment-absent',
    'Not assigned': 'not-assigned',
  }[assessment];
}

// Only finished assessments have a score.
function hasScore(assessment: NonNullable<ProjectCandidate['assessment']>) {
  return assessment === 'Passed' || assessment === 'Failed';
}

function CandidateIdentity({
  candidate,
  profileHref,
  onViewNote,
}: {
  candidate: ProjectCandidate;
  /** Only API candidates with a user id can open the profile. */
  profileHref?: string;
  onViewNote: () => void;
}) {
  const t = useTranslations('companyPage.projects');
  const tReview = useTranslations('companyPage.projects.shared-review');
  const format = useFormatter();
  const interviewDate =
    candidate.interviewDate && candidate.interviewTime
      ? new Date(`${candidate.interviewDate}T${candidate.interviewTime}`)
      : null;
  const interviewLabel =
    interviewDate && !Number.isNaN(interviewDate.getTime())
      ? format.dateTime(interviewDate, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
      : candidate.interview;
  const methodLabel = candidate.interviewMethod
    ? tReview(
        candidate.interviewMethod === 'online' ? 'online' : 'face-to-face',
      )
    : candidate.interviewType;
  const MethodIcon =
    candidate.interviewMethod === 'face_to_face' ? MapPin : Video;
  const statusKey = candidate.status
    ? {
        Rejected: 'rejected',
        Shortlist: 'shortlist',
        'Under review': 'under-review',
      }[candidate.status]
    : null;

  return (
    <div className="flex w-48 items-center gap-3 text-start">
      <Image
        src={candidate.image || CANDIDATE_AVATAR_FALLBACK}
        alt=""
        width={35}
        height={35}
        className="size-[35px] shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0">
        {profileHref ? (
          <Link
            href={profileHref}
            className="block max-w-full truncate font-medium text-foreground underline underline-offset-2 hover:text-primary"
          >
            {candidate.name}
          </Link>
        ) : (
          <span
            className="block max-w-full truncate font-medium text-foreground"
            dir="auto"
            title={candidate.name}
          >
            {candidate.name}
          </span>
        )}
        {candidate.status && statusKey ? (
          <span
            className={cn(
              'mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium',
              getStatusClass(candidate.status),
            )}
          >
            {t(statusKey)}
          </span>
        ) : null}
        {interviewLabel && (
          <div className="mt-2 space-y-1 text-[11px] leading-4 text-muted-foreground">
            <p className="flex items-center gap-1">
              <CalendarDays className="size-3 text-primary" />
              {interviewLabel}
            </p>
            <p className="flex items-center gap-1">
              <MethodIcon className="size-3 shrink-0 text-primary" />
              {methodLabel}
            </p>
            <button
              type="button"
              onClick={onViewNote}
              className="font-medium text-primary underline underline-offset-2"
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
  onViewAssessments,
}: {
  candidate: ProjectCandidate;
  onShareAssessment: () => void;
  onViewAssessments: () => void;
}) {
  const t = useTranslations('companyPage.projects');
  const linkClassName =
    'text-xs font-medium whitespace-nowrap text-primary underline underline-offset-2';

  if (!candidate.assessment) {
    return <span className="text-muted-foreground">{MISSING_API_VALUE}</span>;
  }

  const resultHref = candidate.assessmentResult
    ? getAssessmentResultHref(
        candidate.assessmentResult.assessmentId,
        candidate.assessmentResult.candidateId,
      )
    : null;
  const hasManyAssessments = (candidate.assessmentCount ?? 0) > 1;

  return (
    <div className="flex min-w-28 flex-col items-center gap-1.5 text-center">
      <span className="flex items-center gap-2">
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap',
            getAssessmentClass(candidate.assessment),
          )}
        >
          {t(getAssessmentLabelKey(candidate.assessment))}
        </span>
        {hasScore(candidate.assessment) ? (
          <strong className="text-base text-foreground">
            {candidate.score ?? MISSING_API_VALUE}%
          </strong>
        ) : null}
      </span>
      {candidate.assessment === 'Not assigned' ? (
        <button
          type="button"
          onClick={onShareAssessment}
          className={linkClassName}
        >
          + {t('share-assessment')}
        </button>
      ) : hasManyAssessments && candidate.assessments?.length ? (
        <button
          type="button"
          onClick={onViewAssessments}
          className={linkClassName}
        >
          {t('view-all-assessments', { count: candidate.assessmentCount ?? 0 })}
        </button>
      ) : resultHref ? (
        <Link href={resultHref} className={linkClassName}>
          {hasManyAssessments
            ? t('view-all-assessments', {
                count: candidate.assessmentCount ?? 0,
              })
            : t('view-result')}
        </Link>
      ) : null}
    </div>
  );
}

function CandidateActions({
  candidate,
  onAction,
  onDownloadCv,
}: {
  candidate: ProjectCandidate;
  onAction: ProjectCandidatesTableProps['onAction'];
  onDownloadCv: ProjectCandidatesTableProps['onDownloadCv'];
}) {
  const t = useTranslations('companyPage.projects');
  const hasCv = Boolean(candidate.cv);
  const router = useRouter();
  const tInvitations = useTranslations('companyPage.assessments.invitations');
  const actions = [
    {
      key: 'chat',
      onClick: () => {
        if (!candidate.userId) return;
        router.push(
          getCompanyChatHref({
            userId: candidate.userId,
            name: candidate.name,
            image: candidate.image,
          }),
        );
      },
      disabled: !candidate.userId,
      label: tInvitations('chat-with', { name: candidate.name }),
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
      key: 'download-cv',
      onClick: () => onDownloadCv(candidate),
      disabled: !hasCv,
      label: t('download-cv'),
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
      key: 'view-cv',
      onClick: () => onAction({ type: 'view-cv', candidateId: candidate.id }),
      disabled: !hasCv,
      label: t('view-cv'),
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
      key: 'remove',
      onClick: () => onAction({ type: 'remove', candidateId: candidate.id }),
      disabled: false,
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
          key={action.key}
          type="button"
          variant={action.variant}
          size="default"
          aria-label={action.label}
          title={action.label}
          onClick={action.onClick}
          disabled={action.disabled}
          className={cn(
            'h-[30px] w-[45.25px] rounded-full border-0 px-0 py-0',
            action.key === 'view-cv' && 'border border-secondary bg-card',
            action.key === 'remove' &&
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
  onDownloadCv,
  onShareAssessment,
  onViewAssessments,
  isFiltered,
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
      headerClassName: 'text-center',
      cellClassName: 'text-start',
      renderCell: (candidate) => (
        <CandidateIdentity
          candidate={candidate}
          profileHref={
            candidate.userId
              ? getCandidateProfileHref(candidate.userId)
              : undefined
          }
          onViewNote={() => onViewNote(candidate.id)}
        />
      ),
    },
    {
      id: 'nationality',
      header: t('nationality'),
      headerClassName: 'text-center',
      cellClassName: 'max-w-32 text-center',
      renderCell: (candidate) => candidate.nationality,
    },
    {
      id: 'email',
      header: t('email'),
      headerClassName: 'text-center',
      cellClassName: 'max-w-48 text-center',
      renderCell: (candidate) => (
        <span className="block truncate" title={candidate.email}>
          {candidate.email}
        </span>
      ),
    },
    {
      id: 'phone',
      header: t('phone'),
      headerClassName: 'text-center',
      cellClassName: 'text-center whitespace-nowrap',
      renderCell: (candidate) => <span dir="ltr">{candidate.phone}</span>,
    },
    {
      id: 'assessment',
      header: t('assessment'),
      headerClassName: 'text-center',
      cellClassName: 'text-center',
      renderCell: (candidate) => (
        <AssessmentCell
          candidate={candidate}
          onShareAssessment={() => onShareAssessment(candidate)}
          onViewAssessments={() => onViewAssessments(candidate)}
        />
      ),
    },
    {
      id: 'actions',
      header: t('actions'),
      headerClassName: 'text-center',
      cellClassName: 'text-center',
      renderCell: (candidate) => (
        <CandidateActions
          candidate={candidate}
          onAction={onAction}
          onDownloadCv={onDownloadCv}
        />
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
        className="min-w-[1000px] [&_td]:!px-3 [&_td]:!py-4 [&_td]:!text-sm [&_th]:!py-4 [&_th]:!text-lg [&_th]:!font-semibold"
        headerRowClassName="bg-muted/70"
        rowClassName="border-t border-border bg-body-bg/70 align-middle hover:bg-primary/5"
      />
      {!candidates.length && (
        <p
          role="status"
          className="mt-4 rounded-xl bg-card px-4 py-8 text-center text-sm text-muted-foreground"
        >
          {t(isFiltered ? 'no-candidates' : 'empty-candidates')}
        </p>
      )}
    </div>
  );
}
