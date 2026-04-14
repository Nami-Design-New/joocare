"use client";

import {
  notificationsQueryKey,
  useNotificationsInfinite,
} from "@/features/notifications/hooks/useGetAllNotifications";
import { Link } from "@/i18n/navigation";
import { requestNotificationPermission } from "@/shared/hooks/requestNotificationPermission";
import { listenForMessages } from "@/shared/util/firebase-notifications";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { LanguageToggle } from "../LanguageToggle";
import { Button, buttonVariants } from "../ui/button";
import { DrawerScrollableContent } from "./DrawerScrollableContent";
import UserDropDown from "./UserDropDown";

function HeaderActionsButtons({
  companyHeader,
}: {
  companyHeader: boolean;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: session, status } = useSession();
  const role = session?.authRole;
  const token = session?.accessToken;

  const isLoading = status === "loading";
  const isAuthed = status === "authenticated";
  const { unreadCount } = useNotificationsInfinite(role, token, {
    enabled: isAuthed,
  });

  useEffect(() => {
    if (!isAuthed || !role) {
      return;
    }

    console.info("[Notifications] Subscribing to foreground notifications.", {
      role,
    });

    return listenForMessages(() => {
      console.info("[Notifications] Invalidating notifications query after foreground message.");
      void queryClient.invalidateQueries({
        queryKey: notificationsQueryKey(role),
      });
    });
  }, [isAuthed, queryClient, role]);

  useEffect(() => {
    if (!isAuthed) {
      return;
    }

    console.info("[Notifications] Requesting permission after authenticated app load.");
    void requestNotificationPermission();
  }, [isAuthed]);

  useEffect(() => {
    if (!isAuthed || !open) {
      return;
    }

    console.info("[Notifications] Requesting permission after opening notifications drawer.");
    void requestNotificationPermission();
  }, [isAuthed, open]);

  return (
    <>
      <div
        className="flex items-center justify-center space-x-0 lg:space-x-4"
        role="region"
        aria-label="User Actions"
      >
        {/*  Loading Skeleton (prevents flashing) */}
        {isLoading && (
          <div className="hidden lg:flex items-center gap-3">
            <div className="h-8 w-20 animate-pulse rounded-full bg-muted" />
            <div className="h-8 w-24 animate-pulse rounded-full bg-muted" />
          </div>
        )}

        {/*  Not Authenticated */}
        {!isLoading && !isAuthed && (
          <>
            <Button
              onClick={() => router.push("/auth/candidate/login")}
              variant="default"
              hoverStyle="slideSecondary"
              size="pill"
              className="hidden lg:flex"
            >
              Login
            </Button>

            <Button
              onClick={() => router.push("/auth/candidate/register")}
              variant="outline"
              hoverStyle="slidePrimary"
              size="pill"
              className="hidden lg:flex"
            >
              Join Now
            </Button>
          </>
        )}

        {/* Authenticated */}
        {!isLoading && isAuthed && (
          <div className="hidden items-center gap-4 md:flex">
            <Button
              variant="outline"
              className="border-border relative"
              size="icon-circle"
              aria-label="Notifications"
              onClick={() => setOpen(true)}
            >
              <Image
                src="/assets/icons/notification.svg"
                width={24}
                height={24}
                alt="Notification Icon"
              />

              {unreadCount > 0 && (
                <span className="bg-primary absolute top-0 right-0 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Button>

            <UserDropDown companyHeader={companyHeader} />
          </div>
        )}

        {/*  Always visible */}
        <LanguageToggle aria-label="Toggle Language" />

        {/*  Mobile Notifications */}
        {!isLoading && isAuthed && (
          <Button
            variant="outline"
            className="border-border relative h-8 w-8 md:hidden"
            size="icon-circle"
            aria-label="Notifications"
            onClick={() => setOpen(true)}
          >
            <Image
              src="/assets/icons/notification.svg"
              width={14}
              height={14}
              alt="Notification Icon"
            />

            {unreadCount > 0 && (
              <span className="bg-primary absolute top-0 right-0 flex min-h-3 min-w-3 items-center justify-center rounded-full px-1 text-[8px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Button>
        )}

        {/*  Employer Link */}
        {!isLoading && !isAuthed && (
          <Link
            href="/for-employers"
            className={`text-secondary flex items-center justify-center text-lg ${buttonVariants(
              {
                variant: "outline",
                size: "xl",
                hoverStyle: "hoverBorder",
              },
            )}`}
          >
            For Employer <ChevronRight size={24} />
          </Link>
        )}
      </div>

      {/*  Drawer */}
      {open && (
        <DrawerScrollableContent
          title="notification"
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </>
  );
}

export default HeaderActionsButtons;
