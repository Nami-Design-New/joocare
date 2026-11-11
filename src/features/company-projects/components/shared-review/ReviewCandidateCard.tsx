'use client';

import { Briefcase, Download, Eye, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import type {
  CandidateDecision,
  SharedReviewCandidate,
} from '../../types/shared-review.types';
import ReviewCandidateIdentity from './ReviewCandidateIdentity';

type FinalDecision = Exclude<CandidateDecision, 'Under review'>;

type ReviewCandidateCardProps = {
  candidate: SharedReviewCandidate;
  onPreviewCv: (candidate: SharedReviewCandidate) => void;
  onDownloadCv: (candidate: SharedReviewCandidate) => void;
  onDecision: (candidateId: string, decision: FinalDecision) => void;
};

const CV_ACTION_CLASS =
  'bg-muted text-foreground hover:bg-secondary/10 flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

export default function ReviewCandidateCard({
  candidate,
  onPreviewCv,
  onDownloadCv,
  onDecision,
}: ReviewCandidateCardProps) {
  const t = useTranslations('companyPage.projects.shared-review');
  const decisions = [
    {
      value: 'Rejected',
      label: candidate.status === 'Rejected' ? t('rejected') : t('reject'),
      activeClass: 'bg-destructive text-white',
    },
    {
      value: 'Shortlist',
      label:
        candidate.status === 'Shortlist' ? t('shortlisted') : t('shortlist'),
      activeClass: 'bg-primary text-primary-foreground',
    },
  ] as const;
  const details = [
    { icon: MapPin, value: candidate.nationality },
    { icon: Briefcase, value: candidate.experience },
    { icon: Phone, value: candidate.phone, isLtr: true },
  ];

  return (
    <article className="flex flex-col gap-5 rounded-xl border border-border bg-card p-4">
      <ReviewCandidateIdentity
        candidate={candidate}
        className="border-b border-border pb-3"
      />

      <div className="flex flex-col gap-4 text-sm text-muted-foreground">
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {details.map(({ icon: Icon, value, isLtr }) => (
            <li key={value} className="flex items-center gap-1">
              <Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />
              <span dir={isLtr ? 'ltr' : undefined}>{value}</span>
            </li>
          ))}
        </ul>
        <p className="flex min-w-0 items-center gap-1">
          <Mail
            aria-hidden="true"
            className="size-5 shrink-0"
            strokeWidth={1.5}
          />
          <span dir="ltr" className="truncate">
            {candidate.email}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onPreviewCv(candidate)}
            disabled={!candidate.cv}
            className={CV_ACTION_CLASS}
          >
            <Eye aria-hidden="true" className="size-3.5" />
            {t('preview-cv')}
          </button>
          <button
            type="button"
            onClick={() => onDownloadCv(candidate)}
            disabled={!candidate.cv}
            className={CV_ACTION_CLASS}
          >
            <Download aria-hidden="true" className="size-3.5" />
            {t('download-cv')}
          </button>
        </div>

        <div
          role="group"
          aria-label={t('decision-for', { name: candidate.name })}
          className="flex gap-2"
        >
          {decisions.map(({ value, label, activeClass }) => {
            const isActive = candidate.status === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={isActive}
                onClick={() => onDecision(candidate.id, value)}
                className={cn(
                  'h-11 flex-1 rounded-full px-4 text-sm font-semibold transition-colors',
                  isActive
                    ? activeClass
                    : 'bg-secondary/7 text-secondary/75 hover:bg-secondary/12',
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}
