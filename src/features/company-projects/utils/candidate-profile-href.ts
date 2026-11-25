// Company view of a candidate's profile (`candidateId` is the user id).
export function getCandidateProfileHref(userId: string | number) {
  return `/company/candidate-profile?candidateId=${encodeURIComponent(String(userId))}`;
}
