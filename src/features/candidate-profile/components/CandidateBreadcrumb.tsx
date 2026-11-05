'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import PlainBreadcrumb from '@/shared/components/PlainBreadcramb';
import { CANDIDATE_PAGE_TITLES } from '../constants';

// Candidate dashboard breadcrumb: "Home > {current section}".
export default function CandidateBreadcrumb() {
  const t = useTranslations();
  const pathname = usePathname();
  const page = CANDIDATE_PAGE_TITLES.find(
    ({ path }) => pathname === path || pathname.startsWith(`${path}/`),
  );

  return (
    <PlainBreadcrumb
      items={[
        { label: t('header.home'), href: '/' },
        { label: t(`candidatePage.${page?.label ?? 'overview'}`) },
      ]}
    />
  );
}
