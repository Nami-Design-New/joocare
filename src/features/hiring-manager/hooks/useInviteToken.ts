'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';
import { HIRING_MANAGER_INVITE_TOKEN_PARAM } from '../constants/hiring-manager-routes';
import {
  clearInviteToken,
  getInviteSession,
  storeInviteToken,
  subscribeToInviteToken,
} from '../lib/invite-token-storage';

export function useInviteToken() {
  const searchParams = useSearchParams();
  const urlToken = searchParams.get(HIRING_MANAGER_INVITE_TOKEN_PARAM);
  const session = useSyncExternalStore(
    subscribeToInviteToken,
    getInviteSession,
    () => undefined,
  );

  useEffect(() => {
    if (urlToken === null) return;

    const url = new URL(window.location.href);
    if (url.searchParams.get(HIRING_MANAGER_INVITE_TOKEN_PARAM) !== urlToken)
      return;

    if (urlToken.trim()) {
      storeInviteToken(urlToken.trim());
    } else {
      clearInviteToken();
    }
    url.searchParams.delete(HIRING_MANAGER_INVITE_TOKEN_PARAM);
    window.history.replaceState(null, '', url);
  }, [urlToken]);

  return {
    session,
    isChecking: session === undefined || urlToken !== null,
  };
}
