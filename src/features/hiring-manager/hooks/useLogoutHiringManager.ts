'use client';

import { useMutation } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { flushSync } from 'react-dom';
import { toast } from 'sonner';
import { useRouter } from '@/i18n/navigation';
import {
  clearInviteToken,
  getStoredInviteToken,
} from '../lib/invite-token-storage';
import { logoutHiringManager } from '../services/hiring-manager-review-service';

export function useLogoutHiringManager() {
  const locale = useLocale();
  const t = useTranslations('companyPage.projects.shared-review');
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: (token: string) => logoutHiringManager(token, locale),
    retry: false,
    gcTime: 0,
    onSuccess: (_, token) => {
      const currentToken = getStoredInviteToken();
      if (currentToken && currentToken !== token) return;
      // Clearing the token synchronously notifies the invite subscribers.
      flushSync(() => setIsRedirecting(true));
      clearInviteToken();
      router.replace('/');
    },
    onError: () => {
      toast.error(t('logout-error'));
    },
  });

  const isLoggingOut = isPending || isRedirecting;

  function logout() {
    if (isLoggingOut) return;

    const token = getStoredInviteToken();
    if (token) mutate(token);
    else router.replace('/');
  }

  return { logout, isLoggingOut, isRedirecting };
}
