'use client';

import { useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { requestNotificationPermission } from '@/shared/hooks/requestNotificationPermission';
import { getSafeRedirectPath } from '@/shared/lib/safe-redirect';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';
import { toast } from 'sonner';

type LoginRole = 'candidate' | 'employer';

const providerByRole: Record<LoginRole, string> = {
  candidate: 'candidate-credentials',
  employer: 'employer-credentials',
};

const defaultRedirectByRole: Record<LoginRole, string> = {
  candidate: '/',
  employer: '/company/company-profile',
};

// The proxy saves `callbackUrl` with its locale (e.g. `/en/candidate/...`),
// but the next-intl router adds the locale itself. Split the locale off first,
// otherwise the user lands on `/en/en/...`.
function splitLocaleFromPath(path: string): {
  pathname: string;
  locale?: string;
} {
  const [, firstSegment = ''] = path.match(/^\/([^/?#]+)/) ?? [];

  if (!routing.locales.some((locale) => locale === firstSegment)) {
    return { pathname: path };
  }

  const rest = path.slice(firstSegment.length + 1);
  return {
    pathname: rest.startsWith('/') ? rest : `/${rest}`,
    locale: firstSegment,
  };
}

export const useLogin = (role: LoginRole) => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const searchParams = useSearchParams();

  const login = async (email: string, password: string) => {
    const callbackUrl = getSafeRedirectPath(
      searchParams.get('callbackUrl'),
      defaultRedirectByRole[role],
    );

    const res = await signIn(providerByRole[role], {
      email,
      password,
      locale,
      redirect: false,
      callbackUrl,
    });

    if (!res?.ok) {
      const message = res?.error || t('authPage.toasts.login-failed');
      toast.error(message);
      throw new Error(message);
    }

    const session = await getSession();
    void requestNotificationPermission();
    toast.success(
      session?.authMessage || t('authPage.toasts.logged-in-successfully'),
    );
    const { pathname, locale: callbackLocale } =
      splitLocaleFromPath(callbackUrl);
    router.push(pathname, { locale: callbackLocale });
    router.refresh();
    return res;
  };

  return { login };
};
