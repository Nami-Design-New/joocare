'use client';

import type { ReactNode } from 'react';
import { usePathname } from '@/i18n/navigation';
import Header from '@/shared/components/header/Header';
import { cn } from '@/shared/lib/utils';
import CompanySidebar from './company-sidebar/CompanySidebar';

type CompanyWorkspaceLayoutProps = { children: ReactNode };

export default function CompanyWorkspaceLayout({
  children,
}: CompanyWorkspaceLayoutProps) {
  const pathname = usePathname();
  const isChat = pathname === '/company/chat';
  return (
    <>
      <Header />
      <main
        className={cn('grid grid-cols-12 lg:min-h-dvh', isChat && 'lg:min-h-0')}
      >
        <aside
          className={cn(
            // Mobile: a card inside the page padding (like the candidate area); desktop: full-height column.
            'bg-body-bg col-span-12 px-4 pt-6 md:px-7 lg:col-span-3 lg:block lg:bg-transparent lg:p-0 xl:col-span-2',
            // Mobile chat is full screen, so it has no sidebar.
            isChat && 'hidden',
          )}
        >
          <CompanySidebar />
        </aside>
        <section
          className={cn(
            'bg-body-bg col-span-12 min-w-0 px-4 pt-6 pb-8 md:px-7 md:pt-12 lg:col-span-9 xl:col-span-10',
            isChat && 'px-0 pt-0 pb-0 md:px-7 md:pt-12 md:pb-6',
          )}
        >
          {children}
        </section>
      </main>
    </>
  );
}
