import type { ProjectCandidate } from '../types/company-projects.types';

export function getCandidateCvFileName(candidate: ProjectCandidate) {
  return `${candidate.name} CV.pdf`;
}
