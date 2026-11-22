'use client';

import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';

// Token + locale shared by every company admins request.
export function useCompanyAdminRequestOptions() {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken ?? '';
  return { token, locale };
}
