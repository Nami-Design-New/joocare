'use client';

import Image from 'next/image';
import { useFormatter, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getCandidateProfileHref } from '@/features/company-projects/utils/candidate-profile-href';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import type { AssessmentResultHeaderData } from '../../types/assessment-answers.types';
import type { InvitationStatus } from '../../types/assessment-invitation.types';
import { getCandidateImageSrc } from '../../utils/assessment-results';

const STATUS_CLASS: Record<InvitationStatus, string> = {
  passed: 'bg-assessment-primary/8 text-assessment-primary',
  failed: 'bg-assessment-error/8 text-assessment-error',
  pending: 'bg-assessment-warning/10 text-assessment-warning',
  invitation_pending: 'bg-assessment-warning/10 text-assessment-warning',
  absent: 'bg-assessment-close text-assessment-absent',
};

type CandidateAssessmentHeaderProps = { result: AssessmentResultHeaderData };

export default function CandidateAssessmentHeader({
  result,
}: CandidateAssessmentHeaderProps) {
  const t = useTranslations('companyPage.assessments.answers');
  const status = useTranslations('companyPage.assessments.invitations');
  const format = useFormatter();
  const { counts } = result;
  const statusClass = STATUS_CLASS[result.candidate.status];
  const stats = [
    {
      key: 'score',
      value:
        result.scorePercent === null
          ? '—'
          : `${format.number(result.scorePercent)}%`,
      className: statusClass,
    },
    {
      key: 'correct',
      value: format.number(counts.correct),
      className: 'text-assessment-primary bg-assessment-primary/8',
    },
    {
      key: 'wrong',
      value: format.number(counts.wrong),
      className: 'text-assessment-error bg-assessment-error/8',
    },
    {
      key: 'missing',
      value: format.number(counts.missing),
      className: 'text-assessment-missing bg-assessment-missing/10',
    },
  ] as const;
  const dateRows = [
    { key: 'sent-on', date: result.sentAt },
    { key: 'started-on', date: result.startedAt },
    { key: 'finished-on', date: result.finishedAt },
  ] as const;

  return (
    <Card className="flex-wrap gap-6 rounded-2xl border-0 p-4 shadow-none sm:p-6 xl:flex-row xl:flex-nowrap">
      <div className="flex min-w-0 flex-1 flex-col items-start gap-4 sm:flex-row sm:gap-6">
        <Image
          src={getCandidateImageSrc(result.candidate.image)}
          width={64}
          height={64}
          alt=""
          className="size-16 shrink-0 rounded-full object-cover"
        />
        <div className="w-full min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-assessment-dark">
              {result.candidate.userId ? (
                <Link
                  href={getCandidateProfileHref(result.candidate.userId)}
                  className="underline underline-offset-2"
                >
                  {result.candidate.name}
                </Link>
              ) : (
                result.candidate.name
              )}
            </h1>
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-semibold',
                statusClass,
              )}
            >
              {status(
                result.candidate.status === 'invitation_pending'
                  ? 'invitation-pending'
                  : result.candidate.status,
              )}
            </span>
          </div>
          <p className="text-sm break-all text-assessment-dark">
            {result.candidate.email}
          </p>
          <dl className="space-y-2 pt-2.5 text-sm">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <dt className="w-25 shrink-0 text-assessment-muted">
                {t('assessment')}
              </dt>
              <dd className="min-w-0 flex-1 font-semibold">
                {result.assessmentHref ? (
                  <Link
                    href={result.assessmentHref}
                    className="text-assessment-primary underline underline-offset-2"
                  >
                    {result.assessmentTitle}
                  </Link>
                ) : (
                  <span className="text-assessment-primary">
                    {result.assessmentTitle}
                  </span>
                )}
              </dd>
            </div>
            {dateRows.map(({ key, date }) => (
              <div key={key} className="flex flex-wrap gap-x-3 gap-y-1">
                <dt className="w-25 shrink-0 text-assessment-muted">
                  {t(key)}
                </dt>
                <dd className="text-assessment-main">
                  {date === null ? (
                    '—'
                  ) : (
                    <>
                      {format.dateTime(new Date(date), {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        timeZone: 'UTC',
                      })}{' '}
                      ·{' '}
                      {format.dateTime(new Date(date), {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: 'UTC',
                      })}
                    </>
                  )}
                </dd>
              </div>
            ))}
            <div className="flex gap-3">
              <dt className="w-25 shrink-0 text-assessment-muted">
                {t('time-taken')}
              </dt>
              <dd className="text-assessment-main">
                {t('duration', {
                  minutes: Math.floor(result.durationSeconds / 60),
                  seconds: result.durationSeconds % 60,
                })}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="flex shrink-0 flex-col gap-2 xl:max-w-97">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className={cn(
                'flex min-h-19 flex-col items-center justify-center rounded-full px-3 py-4 sm:min-w-22',
                stat.className,
              )}
            >
              <span className="text-xl leading-7 font-bold sm:text-2xl">
                {stat.value}
              </span>
              <span className="text-xs font-medium uppercase">
                {t(stat.key)}
              </span>
            </div>
          ))}
        </div>
        <p className="text-end text-xs text-assessment-copy">
          {t('questions-summary', {
            total: result.totalQuestions,
            skipped: counts.missing,
          })}
        </p>
      </div>
    </Card>
  );
}
