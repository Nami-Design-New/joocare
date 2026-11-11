'use client';

import { useTranslations } from 'next-intl';
import type { CandidateCareerPreferences } from '../../types/candidate-profile.types';
import CandidateProfileChips from './CandidateProfileChips';
import ProfileSectionCard from './ProfileSectionCard';

type CareerPreferencesSectionProps = {
  preferences: CandidateCareerPreferences;
};

export default function CareerPreferencesSection({
  preferences,
}: CareerPreferencesSectionProps) {
  const t = useTranslations('companyPage.projects.candidate-profile');
  const groups = [
    { key: 'desired-designations', items: preferences.desiredDesignations },
    {
      key: 'preferred-work-locations',
      items: preferences.preferredWorkLocations,
    },
    { key: 'desired-industries', items: preferences.desiredIndustries },
  ] as const;
  const meta = [
    { key: 'notice-period', value: preferences.noticePeriod },
    { key: 'willing-to-relocate', value: preferences.willingToRelocate },
  ] as const;

  return (
    <ProfileSectionCard title={t('career-preferences')}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {groups.map((group) => (
          <div key={group.key} className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-muted-foreground">
              {t(group.key)}
            </h4>
            <CandidateProfileChips items={[...group.items]} />
          </div>
        ))}
      </div>

      <dl className="flex flex-wrap gap-x-10 gap-y-2 border-t border-border pt-3 text-sm font-semibold">
        {meta.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <dt className="text-muted-foreground">{t(item.key)}:</dt>
            <dd dir="auto" className="text-foreground">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </ProfileSectionCard>
  );
}
