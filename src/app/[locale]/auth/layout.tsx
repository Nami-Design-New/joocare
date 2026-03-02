// import libraries
import AuthHeader from "@/features/auth/components/header/AuthHeader";
import SideContent from "@/features/auth/components/side-content/SideContent";
import { ReactNode } from "react";

// import components


const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <AuthHeader />
      <main className="grid grid-cols-2 bg-background">
        <SideContent />
        {children}
      </main>
    </>
  );
};

export default AuthLayout;
