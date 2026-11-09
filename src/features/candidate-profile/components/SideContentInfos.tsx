'use client';

import { useTranslations } from 'next-intl';
import type {
  CandidateProfessionalProfile,
  CandidateProfileViewModel,
} from '../types/profile.types';
import HiringReadiness from './side/HiringReadiness';
import ProfileAvatar from './side/ProfileAvatar';
import ProfileInfoList from './side/ProfileInfoList';
import UploadCvSection from './UploadCvSection';

type SideContentInfosProps = {
  profile: CandidateProfileViewModel | null;
  professional: CandidateProfessionalProfile;
};

const DEFAULT_PROFILE_IMAGE = '/assets/profile_image.svg';

// Profile home side panel: photo, hiring readiness, details and CV.
export default function SideContentInfos({
  profile,
  professional,
}: SideContentInfosProps) {
  const t = useTranslations('candidatePage.profile');

  return (
    <aside className="bg-card border-border flex flex-col gap-7 rounded-2xl border p-4">
      <section className="flex flex-col items-center gap-3 text-center">
        <ProfileAvatar
          image={profile?.image || DEFAULT_PROFILE_IMAGE}
          alt={t('profile-image')}
          isVerified={Boolean(profile?.isVerified)}
        />
        <div className="flex flex-col gap-2">
          <h2 className="text-foreground text-[21px] leading-6.5 font-semibold">
            {profile?.name || t('candidate')}
          </h2>
          <span className="text-assessment-primary text-sm font-semibold">
            {profile?.jobTitle || t('candidate-account')}
          </span>
        </div>
      </section>

      <HiringReadiness
        score={profile?.hiring_readiness_score ?? 0}
        missingItems={profile?.missing_score_items ?? []}
      />

      <ProfileInfoList profile={profile} professional={professional} />

      <UploadCvSection cvUrl={profile?.cv ?? null} />
    </aside>
  );
}
