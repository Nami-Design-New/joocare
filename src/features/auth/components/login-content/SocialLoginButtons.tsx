"use client";

import { useSocialLogin } from "../../hooks/useSocialLogin";
import GoogleButton from "../ui/GoogleButton";
import LinkedInButton from "../ui/LinkedInButton";

const SocialLoginButtons = ({
  role,
}: {
  role: "candidate" | "employer";
}) => {
  const { loginWithProvider } = useSocialLogin(role);

  return (
    <section aria-labelledby="social-login-heading" className="flex gap-4">
      <LinkedInButton onClick={() => loginWithProvider("linkedin")} />
      <GoogleButton onClick={() => loginWithProvider("google")} />
    </section>
  );
};

export default SocialLoginButtons;
