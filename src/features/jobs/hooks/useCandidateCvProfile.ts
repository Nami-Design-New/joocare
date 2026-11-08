import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { CANDIDATE_CV_PROFILE_QUERY_KEY } from '../constants';
import { getCandidateCvProfile } from '../services/apply-job-service';

// The CV saved on the candidate's profile (offered first when applying).
export function useCandidateCvProfile() {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: [CANDIDATE_CV_PROFILE_QUERY_KEY, locale],
    queryFn: () => getCandidateCvProfile({ token: token ?? '', locale }),
    enabled: Boolean(token),
  });
}
