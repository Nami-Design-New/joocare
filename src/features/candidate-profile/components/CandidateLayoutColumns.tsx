'use client';

import type { ReactNode } from 'react';
import { usePathname } from '@/i18n/navigation';
import { CANDIDATE_FULL_WIDTH_ROUTES } from '../constants';

type CandidateLayoutColumnsProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

// Sidebar + page columns of the candidate area; full-width pages (e.g. the CV wizard) hide the sidebar.
export default function CandidateLayoutColumns({
  sidebar,
  children,
}: CandidateLayoutColumnsProps) {
  const pathname = usePathname();
  const isFullWidth = CANDIDATE_FULL_WIDTH_ROUTES.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isFullWidth) {
    return <section className="mt-4 lg:mt-6">{children}</section>;
  }

  return (
    <section className="mt-4 grid grid-cols-12 gap-4 lg:mt-6 lg:items-stretch">
      <section className="col-span-12 lg:col-span-3 lg:h-full">
        {sidebar}
      </section>
      <section className="col-span-12 lg:col-span-9 lg:min-w-0">
        {children}
      </section>
    </section>
  );
}
