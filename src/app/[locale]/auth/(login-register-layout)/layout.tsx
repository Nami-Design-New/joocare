import { ReactNode } from "react";

import AuthHeader from "@/features/auth/components/header/AuthHeader";
import SideContent from "@/features/auth/components/side-content/SideContent";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div role="application" className="h-dvh">
      <AuthHeader />
      <main className="md:grid grid-cols-2 bg-background ">
        {/* side content */}
        <SideContent />

        {/* content */}
        <section className="overflow-y-auto">{children}</section>
      </main>
    </div>
  );
};

export default AuthLayout;
