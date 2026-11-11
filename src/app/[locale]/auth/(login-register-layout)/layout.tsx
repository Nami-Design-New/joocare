import AuthHeader from '@/features/auth/components/header/AuthHeader';
import SideContent from '@/features/auth/components/side-content/SideContent';
import { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div role="application" className="min-h-dvh">
      <AuthHeader />
      <main className="grid-cols-2 bg-background md:grid">
        {/* side content */}
        <SideContent />

        {/* content */}
        <section className="overflow-y-auto">{children}</section>
      </main>
    </div>
  );
};

export default AuthLayout;
