'use client';

import type { ReactNode } from 'react';
import { usePathname } from '@/i18n/navigation';
import { CANDIDATE_ROUTES } from '@/features/candidate-profile/constants';

type CandidateAssessmentRouteLayoutProps = {
  children: ReactNode;
  regularLayout: ReactNode;
};

export default function CandidateAssessmentRouteLayout({
  children,
  regularLayout,
}: CandidateAssessmentRouteLayoutProps) {
  const pathname = usePathname();
  if (!pathname.startsWith(`${CANDIDATE_ROUTES.assessment}/`))
    return regularLayout;
  return (
    <main className="layout-shell min-h-[calc(100dvh-96px)] py-10 lg:px-16">
      <div className="layout-content max-w-none">{children}</div>
    </main>
  );
}
