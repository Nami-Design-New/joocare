"use client";

import { useRouter } from "@/i18n/navigation";
import { requestNotificationPermission } from "@/shared/hooks/requestNotificationPermission";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { toast } from "sonner";

type LoginRole = "candidate" | "employer";

const providerByRole: Record<LoginRole, string> = {
  candidate: "candidate-credentials",
  employer: "employer-credentials",
};

const defaultRedirectByRole: Record<LoginRole, string> = {
  candidate: "/",
  employer: "/company/company-profile",
};

export const useLogin = (role: LoginRole) => {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const login = async (email: string, password: string) => {
    const callbackUrl =
      searchParams.get("callbackUrl") ?? defaultRedirectByRole[role];

    const res = await signIn(providerByRole[role], {
      email,
      password,
      locale,
      redirect: false,
      callbackUrl,
    });

    if (!res?.ok) {
      const message = res?.error || "Login failed";
      toast.error(message);
      throw new Error(message);
    }

    const session = await getSession();
    void requestNotificationPermission();
    toast.success(session?.authMessage || "Logged in successfully.");
    router.push(callbackUrl);
    router.refresh();
    return res;
  };

  return { login };
};
