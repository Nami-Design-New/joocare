'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { LanguageToggle } from '@/shared/components/LanguageToggle';
import DynamicLink from './DynamicLink';
import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';

function LanguageToggleSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="h-12 w-24 animate-pulse rounded-full bg-muted"
    />
  );
}

const AuthHeader = () => {
  const pathname = usePathname();
  const t = useTranslations();
  const hiddenDynamicLink = pathname.includes('password');

  return (
    <header className="sticky top-0 z-3 h-19 w-full bg-white px-[clamp(.1rem,2vw,3rem)] py-4 shadow-header">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" aria-label={t('authPage.header.homepage-aria')}>
          <Image
            src="/assets/new-logo-dot.svg"
            alt={t('authPage.header.logo-alt')}
            width={120}
            height={100}
            priority
          />
        </Link>
        <nav className="flex items-center gap-2 md:gap-4">
          {!hiddenDynamicLink && <DynamicLink />}

          <Suspense fallback={<LanguageToggleSkeleton />}>
            <LanguageToggle />
          </Suspense>
        </nav>
      </div>
    </header>
  );
};

export default AuthHeader;
