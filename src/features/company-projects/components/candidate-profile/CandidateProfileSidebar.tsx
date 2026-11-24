'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { CandidateProfileViewModel } from '@/features/candidate-profile/types/profile.types';
import { cn } from '@/shared/lib/utils';
import { CANDIDATE_JOB_SEARCH_STATUSES } from '../../constants/candidate-job-search-status';
import type {
  CandidateProfileDetailKey,
  CandidateProfileSummary,
} from '../../types/candidate-profile.types';
import CandidateProfileChips from './CandidateProfileChips';

const DEFAULT_PROFILE_IMAGE = '/assets/profile_image.svg';
const LTR_DETAIL_KEYS = new Set<CandidateProfileDetailKey>(['email', 'phone']);

type CandidateProfileSidebarProps = {
  profile: CandidateProfileViewModel;
  summary: CandidateProfileSummary;
};

export default function CandidateProfileSidebar({
  profile,
  summary,
}: CandidateProfileSidebarProps) {
  const t = useTranslations('companyPage.projects.candidate-profile');
  const status = CANDIDATE_JOB_SEARCH_STATUSES.find(
    ({ value }) => value === summary.jobSearchStatus,
  );

  return (
    <aside className="flex flex-col gap-7 rounded-2xl border bg-card p-4">
      <section className="flex flex-col items-center gap-3 text-center">
        <div className="flex flex-col items-center">
          <span
            className={cn(
              'rounded-full border-[3px] p-[3px]',
              status?.borderClassName ?? 'border-primary',
            )}
          >
            <Image
              src={profile.image ?? DEFAULT_PROFILE_IMAGE}
              alt={t('profile-image', { name: profile.name })}
              width={150}
              height={150}
              className="size-28 rounded-full object-cover sm:size-37.5"
            />
          </span>
          {status && (
            <span
              className={cn(
                '-mt-3.5 max-w-full rounded-full border-2 border-card px-3 py-0.5 text-[13px] font-semibold text-primary-foreground',
                status.badgeClassName,
              )}
            >
              {t(status.label)}
            </span>
          )}
          {summary.jobSearchStatusPlaceholder && (
            <p className="mt-2 text-xs text-muted-foreground">
              {t('job-search-status')}{' '}
              <bdi>{summary.jobSearchStatusPlaceholder}</bdi>
            </p>
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-[21px] font-semibold text-foreground">
            {profile.name}
          </h1>
          {profile.jobTitle && (
            <p className="text-sm font-semibold text-primary">
              {profile.jobTitle}
            </p>
          )}
          {summary.lastActive && (
            <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-muted-foreground"
              />
              {t('last-active')} <bdi>{summary.lastActive}</bdi>
            </p>
          )}
        </div>
      </section>

      <dl className="flex flex-col gap-3 text-sm font-semibold">
        {summary.details.map((detail) => (
          <div
            key={detail.key}
            className="flex items-center justify-between gap-4 p-2"
          >
            <dt className="shrink-0 text-muted-foreground">{t(detail.key)}</dt>
            <dd
              title={detail.value}
              dir={LTR_DETAIL_KEYS.has(detail.key) ? 'ltr' : 'auto'}
              className="min-w-0 truncate text-foreground"
            >
              {detail.value}
            </dd>
          </div>
        ))}

        <div className="flex flex-col gap-2 p-2">
          <dt className="text-muted-foreground">{t('languages-known')}</dt>
          <dd>
            <CandidateProfileChips items={summary.languages} />
          </dd>
        </div>

        <div className="flex items-center justify-between gap-4 p-2">
          <dt className="text-muted-foreground">{t('driving-license')}</dt>
          <dd className="text-foreground">{summary.drivingLicense}</dd>
        </div>

        <div className="ms-2 flex flex-col gap-2 border-s-2 border-border py-2 ps-4">
          <dt className="text-[13px] text-muted-foreground">
            {t('issuing-countries')}
          </dt>
          <dd>
            <CandidateProfileChips items={summary.licenseCountries} />
          </dd>
        </div>
      </dl>
    </aside>
  );
}
