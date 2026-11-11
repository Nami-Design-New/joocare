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

type SharedReviewHeaderProps = {
  experience?: 'company' | 'hiring-manager';
};

export default function SharedReviewHeader({
  experience = 'company',
}: SharedReviewHeaderProps) {
  const t = useTranslations('companyPage.projects.shared-review');
  const { logout } = useLogout();
  const isHiringManager = experience === 'hiring-manager';
  const homeHref = isHiringManager
    ? '/hiring-manager/create-password'
    : EMPLOYER_LANDING_HREF;
  const logoutHref = isHiringManager
    ? '/hiring-manager/create-password'
    : EMPLOYER_LOGIN_HREF;

  return (
    <header className="layout-shell sticky top-0 z-30 flex h-19 w-full items-center bg-white py-4 shadow-header">
      <div className="layout-content flex items-center justify-between">
        <Link href={homeHref} aria-label={t('home')}>
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
            fallback={<div className="h-13 w-24 rounded-full bg-muted" />}
          >
            <LanguageToggle aria-label={t('language')} />
          </Suspense>
          <Button
            type="button"
            variant="outline"
            onClick={() => logout({ redirectTo: logoutHref })}
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
