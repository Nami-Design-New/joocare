import { candidateProfilePreview } from '@/features/company-projects/constants/candidate-profile-preview-data';
import type { ProjectCandidateProfile } from '@/features/company-projects/types/candidate-profile.types';
import { talentPreviewCandidates } from '../constants/talent-preview-data';

export function getTalentCandidateProfile(
  candidateId: string,
): ProjectCandidateProfile | null {
  const candidate = talentPreviewCandidates.find(
    (item) => item.id === candidateId,
  );
  if (!candidate) return null;
  return {
    ...candidateProfilePreview,
    profile: {
      ...candidateProfilePreview.profile,
      name: candidate.name,
      email: candidate.email,
      fullPhone: candidate.phone,
      cv: candidate.cv,
    },
    summary: {
      ...candidateProfilePreview.summary,
      details: candidateProfilePreview.summary.details.map((detail) =>
        detail.key === 'email'
          ? { ...detail, value: candidate.email }
          : detail.key === 'phone'
            ? { ...detail, value: candidate.phone }
            : detail,
      ),
    },
  };
}

export const TALENT_PROFILE_SOURCE = 'talent-database';

// `jobId` makes the profile's back link return to that job's AI Talent Match.
export function getTalentProfileHref(candidateId: string, jobId?: string) {
  const params = new URLSearchParams({
    candidateId,
    source: TALENT_PROFILE_SOURCE,
  });
  if (jobId) params.set('jobId', jobId);
  return `/company/candidate-profile?${params.toString()}`;
}
