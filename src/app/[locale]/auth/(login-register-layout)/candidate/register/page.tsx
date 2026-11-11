import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import FormCandidateRegister from '@/features/auth/components/register-employer-content/FormCandidateRegister';
import SocialLoginButtons from '@/features/auth/components/login-content/SocialLoginButtons';

const RegisterCandidatePage = async () => {
  const t = await getTranslations();

  return (
    <div className="flex items-center justify-center gap-4">
      <div className="mx-auto w-full p-4 md:w-3/4">
        {/* header text */}
        <h1>{t('authPage.pages.candidate-register.title')}</h1>

        {/* Login form */}
        <FormCandidateRegister />

        {/* social buttons */}
        <div className="my-4 flex items-center gap-3 text-sm font-medium text-gray-500 before:h-px before:flex-1 before:bg-gray-200 before:content-[''] after:h-px after:flex-1 after:bg-gray-200 after:content-['']">
          {t('authPage.common.or')}
        </div>

        <SocialLoginButtons role="candidate" />

        {/* Bottom CTA */}
        <section className="border-t border-gray-100 pt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('authPage.common.already-have-account')}{' '}
            <Link
              href="/auth/candidate/login"
              className="font-medium text-primary underline transition-colors hover:text-primary/60"
            >
              {t('authPage.common.sign-in')}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default RegisterCandidatePage;
