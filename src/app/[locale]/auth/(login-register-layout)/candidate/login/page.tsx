import { Suspense } from 'react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import SocialLoginButtons from '@/features/auth/components/login-content/SocialLoginButtons';
import FormCandidateLogin from '@/features/auth/components/login-content/FormCandidateLogin';

function LoginFormSkeleton() {
  return (
    <div aria-hidden="true" className="mt-6 flex flex-col gap-4">
      <div className="h-14 w-full animate-pulse rounded-2xl bg-muted" />
      <div className="h-14 w-full animate-pulse rounded-2xl bg-muted" />
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="flex justify-center">
        <div className="h-11 w-1/3 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}

const LoginCandidatePage = async () => {
  const t = await getTranslations();

  return (
    <main className="flex min-h-[calc(100dvh-4.75rem)] items-center justify-center gap-4">
      <section
        aria-labelledby="employer-login-page"
        className="mx-auto w-full p-4 md:w-3/4"
      >
        {/* header text */}
        <h1>{t('authPage.pages.candidate-login.title')}</h1>
        <p className="mt-2 mb-8 text-[clamp(.8rem,4vw,1rem)]">
          {t('authPage.pages.candidate-login.subtitle')}
        </p>

        {/* Login form */}
        <Suspense fallback={<LoginFormSkeleton />}>
          <FormCandidateLogin />
        </Suspense>

        {/* social buttons */}
        <div className="my-4 flex items-center gap-3 text-sm font-medium text-gray-500 before:h-px before:flex-1 before:bg-gray-200 before:content-[''] after:h-px after:flex-1 after:bg-gray-200 after:content-['']">
          {t('authPage.common.or')}
        </div>

        <SocialLoginButtons role="candidate" />
        {/* Bottom CTA */}
        <section className="border-t border-gray-100 pt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('authPage.common.not-member-yet')}{' '}
            <Link
              href="/auth/candidate/register"
              className="font-medium text-primary underline transition-colors hover:text-primary/60"
            >
              {t('header.join-now')}
            </Link>
          </p>
        </section>
      </section>
    </main>
  );
};

export default LoginCandidatePage;
