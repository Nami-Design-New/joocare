"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { UNAUTHORIZED_EVENT } from "@/shared/lib/fetch-manager";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function UnauthorizedSessionHandler() {
  const pathname = usePathname();
  const { logout } = useLogout();
  const { data: session } = useSession();
  const isHandlingUnauthorizedRef = useRef(false);

  useEffect(() => {
    if (session?.accessToken) {
      isHandlingUnauthorizedRef.current = false;
    }
  }, [session?.accessToken]);

  useEffect(() => {
    const handleUnauthorized = async () => {
      if (isHandlingUnauthorizedRef.current || !session?.accessToken) {
        return;
      }

      isHandlingUnauthorizedRef.current = true;

      const redirectTo = pathname.includes("/company")
        ? "/auth/employer/login"
        : "/auth/candidate/login";

      await logout({
        redirectTo,
        showSuccessToast: false,
        showErrorToast: false,
      });
      toast.error("Your session has expired. Please log in again.");
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [logout, pathname, session?.accessToken]);

  return null;
}
