'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LanguageToggle } from '@/shared/components/LanguageToggle';
import { CANDIDATE_ROUTES } from '@/features/candidate-profile/constants';

type CandidateAssessmentSiteLayoutProps = {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
};

export default function CandidateAssessmentSiteLayout({
  children,
  header,
  footer,
}: CandidateAssessmentSiteLayoutProps) {
  const pathname = usePathname();
  const t = useTranslations('candidatePage.assessment.api');
  const isAssessment = pathname.startsWith(`${CANDIDATE_ROUTES.assessment}/`);
  if (!isAssessment)
    return (
      <main className="relative">
        {header}
        <main className="min-h-screen">{children}</main>
        {footer}
      </main>
    );
  return (
    <div className="min-h-dvh bg-dashboard-stat-bg">
      <header className="layout-shell bg-card py-[18px] lg:px-22">
        <div className="layout-content flex h-15 items-center justify-between">
          <Link href="/" aria-label={t('home')}>
            <Image
              src="/assets/candidate-assessment/figma/logo.svg"
              alt={t('logo')}
              width={184.397}
              height={32}
              priority
            />
          </Link>
          <LanguageToggle aria-label={t('language')} />
        </div>
      </header>
      {children}
    </div>
  );
}
