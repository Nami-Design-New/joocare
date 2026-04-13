"use client";

import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { getAuthApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

export const useLogout = () => {
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();

  const logout = async () => {
    const authRole = session?.authRole;
    const accessToken = session?.accessToken;

    try {
      if (authRole && accessToken) {
        const { ok, message } = await apiFetch(`${getAuthApiUrl(authRole)}/auth/logout`, {
          method: "POST",
          locale,
          token: accessToken,
          body: new FormData(),
        });

        if (!ok) {
          throw new Error(message || "Logout failed.");
        }

        toast.success(message || "Logged out successfully.");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Logout failed.";
      toast.error(message);
    } finally {
      await signOut({ redirect: false });
      router.push("/");
      router.refresh();
    }
  };

  return { logout };
};
