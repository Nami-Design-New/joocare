'use client';

import { useSession } from 'next-auth/react';
import useGetCandidateProfile from '@/features/candidate-profile/hooks/useGetCandidateProfile';
import type { CandidateProfileApiUser } from '@/features/candidate-profile/types/profile.types';

// Category saved in Basic info (`category_id`, or the id of the `category` object).
export default function useProfileCategoryId() {
  const { data: session } = useSession();
  const { data, isPending } = useGetCandidateProfile({
    token: session?.accessToken ?? '',
  });
  const profile = data as CandidateProfileApiUser | null | undefined;

  return {
    categoryId: profile?.category_id ?? profile?.category?.id ?? null,
    isPending,
  };
}
