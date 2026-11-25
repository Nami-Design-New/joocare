'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from '@/i18n/navigation';
import {
  HIRING_MANAGER_INVITE_TOKEN_PARAM,
  HIRING_MANAGER_ROUTES,
} from '../constants/hiring-manager-routes';
import {
  getStoredInviteToken,
  storeInviteToken,
  subscribeToInviteToken,
} from '../lib/invite-token-storage';

type InviteTokenStatus = 'checking' | 'valid' | 'missing';

/**
 * Reads the hiring-manager invite token from the URL (`?token=`) and persists
 * it in sessionStorage. Later visits in the same tab rely on the stored token;
 * without one the user is redirected to the employer login.
 */
export function useInviteToken() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get(HIRING_MANAGER_INVITE_TOKEN_PARAM);
  const storedToken = useSyncExternalStore<string | null | undefined>(
    subscribeToInviteToken,
    getStoredInviteToken,
    () => undefined,
  );

  const token = urlToken || storedToken;
  const status: InviteTokenStatus =
    storedToken === undefined && !urlToken
      ? 'checking'
      : token
        ? 'valid'
        : 'missing';

  useEffect(() => {
    if (urlToken) {
      storeInviteToken(urlToken);
      return;
    }

    if (status === 'missing') {
      router.replace(HIRING_MANAGER_ROUTES.login);
    }
  }, [urlToken, status, router]);

  return { token: token || null, status };
}
