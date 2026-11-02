'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { CandidateProfileViewModel } from '@/features/candidate-profile/types/profile.types';
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

  return (
    <aside className="bg-card flex flex-col gap-7 rounded-2xl border p-4">
      <section className="flex flex-col items-center gap-3 text-center">
        <div className="flex flex-col items-center">
          <span className="border-primary rounded-full border-[3px] p-[3px]">
            <Image
              src={profile.image ?? DEFAULT_PROFILE_IMAGE}
              alt={t('profile-image', { name: profile.name })}
              width={150}
              height={150}
              className="size-37.5 rounded-full object-cover"
            />
          </span>
          {summary.isOpenToWork && (
            <span className="bg-primary text-primary-foreground border-card -mt-3.5 rounded-full border-2 px-3 py-0.5 text-[13px] font-semibold">
              {t('open-to-work')}
            </span>
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-foreground text-[21px] font-semibold">
            {profile.name}
          </h1>
          {profile.jobTitle && (
            <p className="text-primary text-sm font-semibold">
              {profile.jobTitle}
            </p>
          )}
          <p className="text-muted-foreground flex items-center gap-1.5 text-[13px]">
            <span
              aria-hidden="true"
              className="bg-gray-45 size-1.5 rounded-full"
            />
            {t('last-active')} <bdi>{summary.lastActive}</bdi>
          </p>
        </div>
      </section>

      <dl className="flex flex-col gap-3 text-sm font-semibold">
        {summary.details.map((detail) => (
          <div
            key={detail.key}
            className="flex items-center justify-between gap-4 p-2"
          >
            <dt className="text-muted-foreground shrink-0">{t(detail.key)}</dt>
            <dd
              title={detail.value}
              dir={LTR_DETAIL_KEYS.has(detail.key) ? 'ltr' : 'auto'}
              className="text-foreground min-w-0 truncate"
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

        <div className="border-border ms-2 flex flex-col gap-2 border-s-2 py-2 ps-4">
          <dt className="text-muted-foreground text-[13px]">
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
