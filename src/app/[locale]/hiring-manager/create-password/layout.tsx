import AuthHeader from '@/features/auth/components/header/AuthHeader';
import SideContent from '@/features/auth/components/side-content/SideContent';
import type { ReactNode } from 'react';

export default function HiringManagerCreatePasswordLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div role="application" className="min-h-dvh">
      <AuthHeader />
      <main className="bg-background md:grid md:grid-cols-2">
        <SideContent />
        <section className="overflow-y-auto">{children}</section>
      </main>
    </div>
  );
}
