'use client';

import { useTranslations } from 'next-intl';
import SidebarLinks from '@/shared/components/SidebarLinks';
import type { SidebarLinkItem } from '@/shared/types/sidebar-link.types';
import {
  CANDIDATE_SIDEBAR_BOTTOM_LINKS,
  CANDIDATE_SIDEBAR_LINKS,
} from '../constants';

type CandidateSideContentLinksProps = {
  isCompleted?: boolean | null;
};

export default function CandidateSideContentLinks({
  isCompleted,
}: CandidateSideContentLinksProps) {
  const t = useTranslations('candidatePage.sidebar');

  const translateLinks = (links: readonly SidebarLinkItem[]) =>
    links.map((link) => ({ ...link, label: t(link.label) }));

  return (
    <aside className="no-scrollbar flex h-full flex-col gap-2 overflow-y-auto rounded-2xl bg-white px-3 py-6 shadow lg:min-h-[calc(100dvh-150px)] lg:gap-5">
      <SidebarLinks
        links={translateLinks(CANDIDATE_SIDEBAR_LINKS)}
        bottomLinks={translateLinks(CANDIDATE_SIDEBAR_BOTTOM_LINKS)}
      />

      {!isCompleted && (
        <section className="bg-destructive/5 mt-2 flex flex-col gap-3 rounded-2xl px-4 py-3 lg:mt-0">
          <h3 className="text-destructive text-xl font-semibold">
            {t('complete-details-title')}
          </h3>
          <p className="text-muted-foreground text-base">
            {t('complete-details-description')}
          </p>
        </section>
      )}
    </aside>
  );
}
