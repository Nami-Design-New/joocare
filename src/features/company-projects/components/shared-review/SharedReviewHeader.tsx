'use client';

import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { Link } from '@/i18n/navigation';
import { LanguageToggle } from '@/shared/components/LanguageToggle';
import { Button } from '@/shared/components/ui/button';

const EMPLOYER_LANDING_HREF = '/for-employers';
const EMPLOYER_LOGIN_HREF = '/auth/employer/login';

export default function SharedReviewHeader() {
  const t = useTranslations('companyPage.projects.shared-review');
  const { logout } = useLogout();

  return (
    <header className="layout-shell shadow-header sticky top-0 z-30 flex h-19 w-full items-center bg-white py-4">
      <div className="layout-content flex items-center justify-between">
        <Link href={EMPLOYER_LANDING_HREF} aria-label={t('home')}>
          <Image
            src="/assets/new-logo-dot.svg"
            alt={t('logo-alt')}
            width={125}
            height={30}
            priority
            className="h-auto w-24 lg:w-31"
          />
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <Suspense
            fallback={<div className="bg-muted h-13 w-24 rounded-full" />}
          >
            <LanguageToggle aria-label={t('language')} />
          </Suspense>
          <Button
            type="button"
            variant="outline"
            onClick={() => logout({ redirectTo: EMPLOYER_LOGIN_HREF })}
            className="h-10 gap-2 rounded-full px-5 text-sm font-normal"
          >
            <LogOut className="size-5 rtl:rotate-180" strokeWidth={1.5} />
            {t('logout')}
          </Button>
        </div>
      </div>
    </header>
  );
}
