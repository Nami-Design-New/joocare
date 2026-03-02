// import libraries
import { ReactNode } from "react";

// import components
import AuthHeader from "../components/header/AuthHeader";
import SideContent from "../components/side-content/SideContent";

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
