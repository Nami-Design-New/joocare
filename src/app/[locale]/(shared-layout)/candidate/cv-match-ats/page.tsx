import AtsMatchPage from '@/features/candidate-cv-match-ats/components/AtsMatchPage';
import { ATS_MATCH_VIEWS } from '@/features/candidate-cv-match-ats/constants';
import { getCandidateProfile } from '@/features/candidate-profile/services/profile-service';
import { getFileNameFromUrl } from '@/shared/lib/file-name';

type PageProps = {
  searchParams: Promise<{ state?: string }>;
};

// `?state=analyzing | results | coming-soon` shows the other states (design only).
export default async function Page({ searchParams }: PageProps) {
  const [{ state }, profile] = await Promise.all([
    searchParams,
    getCandidateProfile(),
  ]);
  const view = ATS_MATCH_VIEWS.find((item) => item === state) ?? 'intro';

  return (
    <AtsMatchPage
      key={view}
      initialView={view}
      profileCvName={getFileNameFromUrl(profile?.cv)}
    />
  );
}
