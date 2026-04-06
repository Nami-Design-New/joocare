"use client";

import { useLocale } from "next-intl";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

type LoginRole = "candidate" | "employer";
type SocialProvider = "google" | "linkedin";

const providerByRole: Record<LoginRole, Record<SocialProvider, string>> = {
  candidate: {
    google: "google-candidate",
    linkedin: "linkedin-candidate",
  },
  employer: {
    google: "google-employer",
    linkedin: "linkedin-employer",
  },
};

const defaultRedirectByRole: Record<LoginRole, string> = {
  candidate: "/",
  employer: "/company/company-profile",
};

export const useSocialLogin = (role: LoginRole) => {
  const locale = useLocale();

  const loginWithProvider = async (provider: SocialProvider) => {
    try {
      const callbackUrl =
        role === "employer"
          ? `/${locale}${defaultRedirectByRole[role]}`
          : `/${locale}`;

      await signIn(providerByRole[role][provider], {
        callbackUrl,
      });
    } catch {
      toast.error("Unable to start social login.");
    }
  };

  return { loginWithProvider };
};
