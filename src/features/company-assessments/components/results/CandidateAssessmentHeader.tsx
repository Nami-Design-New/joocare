'use client';

import Image from 'next/image';
import { useFormatter, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { ASSESSMENT_ASSETS } from '../../constants/assessment-invitations';
import type { CandidateAssessmentResult } from '../../types/assessment-answers.types';
import { getAnswerStatus } from '../../utils/assessment-answers';

type CandidateAssessmentHeaderProps = { result: CandidateAssessmentResult };

export default function CandidateAssessmentHeader({
  result,
}: CandidateAssessmentHeaderProps) {
  const t = useTranslations('companyPage.assessments.answers');
  const status = useTranslations('companyPage.assessments.invitations');
  const format = useFormatter();
  const counts = result.questions.reduce(
    (summary, question) => {
      summary[getAnswerStatus(question)] += 1;
      return summary;
    },
    { correct: 0, wrong: 0, missing: 0 },
  );
  const stats = [
    {
      key: 'score',
      value: `${format.number(result.candidate.score ?? 0)}%`,
      className:
        result.candidate.status === 'passed'
          ? 'text-assessment-primary bg-assessment-primary/8'
          : 'text-assessment-error bg-assessment-error/8',
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
    <Card className="flex-wrap gap-6 rounded-2xl border-0 p-6 shadow-none xl:flex-row xl:flex-nowrap">
      <div className="flex min-w-0 flex-1 flex-col items-start gap-4 sm:flex-row sm:gap-6">
        <Image
          src={`${ASSESSMENT_ASSETS}/${result.candidate.image}`}
          width={64}
          height={64}
          alt=""
          className="size-16 shrink-0 rounded-full object-cover"
        />
        <div className="w-full min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-assessment-dark text-xl font-bold">
              {result.candidate.name}
            </h1>
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-semibold',
                result.candidate.status === 'passed'
                  ? 'text-assessment-primary bg-assessment-primary/8'
                  : 'text-assessment-error bg-assessment-error/8',
              )}
            >
              {status(result.candidate.status)}
            </span>
          </div>
          <p className="text-assessment-dark text-sm break-all">
            {result.candidate.email}
          </p>
          <dl className="space-y-2 pt-2.5 text-sm">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <dt className="text-assessment-muted w-25 shrink-0">
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
                <dt className="text-assessment-muted w-25 shrink-0">
                  {t(key)}
                </dt>
                <dd className="text-assessment-main">
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
                </dd>
              </div>
            ))}
            <div className="flex gap-3">
              <dt className="text-assessment-muted w-25 shrink-0">
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
        <div className="grid grid-cols-4 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className={cn(
                'flex min-h-19 flex-col items-center justify-center rounded-full px-3 py-4 sm:min-w-22',
                stat.className,
              )}
            >
              <span className="text-2xl leading-7 font-bold">{stat.value}</span>
              <span className="text-xs font-medium uppercase">
                {t(stat.key)}
              </span>
            </div>
          ))}
        </div>
        <p className="text-assessment-copy text-end text-xs">
          {t('questions-summary', {
            total: result.questions.length,
            skipped: counts.missing,
          })}
        </p>
      </div>
    </Card>
  );
}
