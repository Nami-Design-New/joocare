import { candidateProfilePreview } from '../constants/candidate-profile-preview-data';
import { projectCandidatePreviewData } from '../constants/project-preview-data';
import type { ProjectCandidateProfile } from '../types/candidate-profile.types';
import type { ProjectCandidate } from '../types/company-projects.types';

export function getProjectCandidateProfile(
  candidateId: string,
): ProjectCandidateProfile | null {
  const candidate = projectCandidatePreviewData.find(
    (item) => item.id === candidateId,
  );
  if (!candidate) return null;

  const { profile, summary } = candidateProfilePreview;

  return {
    ...candidateProfilePreview,
    profile: {
      ...profile,
      name: candidate.name,
      email: candidate.email,
      fullPhone: candidate.phone,
    },
    summary: {
      ...summary,
      details: summary.details.map((detail) => {
        if (detail.key === 'email')
          return { ...detail, value: candidate.email };
        if (detail.key === 'phone')
          return { ...detail, value: candidate.phone };
        return detail;
      }),
    },
  };
}

export function getCandidateCvFileName(candidate: ProjectCandidate) {
  return `${candidate.name} CV.pdf`;
}
