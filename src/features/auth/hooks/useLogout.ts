"use client";

import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { getAuthApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

type LogoutOptions = {
  redirectTo?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
};

export const useLogout = () => {
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();

  const logout = async (options: LogoutOptions = {}) => {
    const {
      redirectTo,
      showSuccessToast = true,
      showErrorToast = true,
    } = options;
    const authRole = session?.authRole;
    const accessToken = session?.accessToken;
    const resolvedRedirectTo = redirectTo ?? "/";

    try {
      if (authRole && accessToken) {
        const { ok, message } = await apiFetch(`${getAuthApiUrl(authRole)}/auth/logout`, {
          method: "POST",
          locale,
          token: accessToken,
          body: new FormData(),
          skipUnauthorizedHandler: true,
        });

        if (!ok) {
          throw new Error(message || "Logout failed.");
        }

        if (showSuccessToast) {
          toast.success(message || "Logged out successfully.");
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Logout failed.";
      if (showErrorToast) {
        toast.error(message);
      }
    } finally {
      await signOut({ redirect: false });
      router.push(resolvedRedirectTo);
      router.refresh();
    }
  };

  return { logout };
};
