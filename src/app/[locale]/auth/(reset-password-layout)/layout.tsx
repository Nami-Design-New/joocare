import { ReactNode } from "react";

import AuthHeader from "@/features/auth/components/header/AuthHeader";

const ResetPasswordLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="bg-white">
            <AuthHeader />
            {children}
        </div>
    );
};

export default ResetPasswordLayout;
