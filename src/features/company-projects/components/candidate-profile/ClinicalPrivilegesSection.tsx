'use client';

import { useTranslations } from 'next-intl';
import CandidateProfileChips from './CandidateProfileChips';
import ProfileSectionCard from './ProfileSectionCard';

type ClinicalPrivilegesSectionProps = {
  privileges: string[];
};

export default function ClinicalPrivilegesSection({
  privileges,
}: ClinicalPrivilegesSectionProps) {
  const t = useTranslations('companyPage.projects.candidate-profile');

  return (
    <ProfileSectionCard title={t('clinical-privileges')}>
      <CandidateProfileChips items={privileges} />
    </ProfileSectionCard>
  );
}
