// import libraries
import { ReactNode } from "react";

// import components
import AuthHeader from "./components/header/AuthHeader";
import SideContent from "./components/side-content/SideContent";

type Props = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div>
      <AuthHeader />
      <div className="md:grid grid-cols-2 bg-background">
        <SideContent />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
