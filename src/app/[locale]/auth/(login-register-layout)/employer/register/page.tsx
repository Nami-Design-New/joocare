import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import FormEmployerRegister from '@/features/auth/components/register-employer-content/FormEmployerRegister';

const RegisterEmployerPage = async () => {
  const t = await getTranslations();

  return (
    <div className="flex items-center justify-center gap-4">
      <div className="mx-auto w-full p-4 md:w-3/4">
        {/* header text */}
        <h1>{t('authPage.pages.employer-register.title')}</h1>

        {/* Login form */}
        <FormEmployerRegister />

        {/* Bottom CTA */}
        <section className="border-t border-gray-100 pt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('authPage.common.already-have-account')}{' '}
            <Link
              href="/auth/employer/login"
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

export default RegisterEmployerPage;
