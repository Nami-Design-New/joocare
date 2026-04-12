"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LanguageToggle } from "../LanguageToggle";
import { Button, buttonVariants } from "../ui/button";
import UserDropDown from "./UserDropDown";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { DrawerScrollableContent } from "./DrawerScrollableContent";

function HeaderActionsButtons({
  companyHeader,
}: {
  companyHeader: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("Header");

  const { status } = useSession();

  const isLoading = status === "loading";
  const isAuthed = status === "authenticated";

  return (
    <>
      <div
        className="flex items-center justify-center space-x-0 lg:space-x-4"
        role="region"
        aria-label={tHeader("userActions")}
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
              {tCommon("login")}
            </Button>

            <Button
              onClick={() => router.push("/auth/candidate/register")}
              variant="outline"
              hoverStyle="slidePrimary"
              size="pill"
              className="hidden lg:flex"
            >
              {tCommon("joinNow")}
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
              aria-label={tHeader("notifications")}
              onClick={() => setOpen(true)}
            >
              <Image
                src="/assets/icons/notification.svg"
                width={24}
                height={24}
                alt="Notification Icon"
              />

              <span className="bg-primary absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full px-1 text-xs font-bold text-white">
                3
              </span>
            </Button>

            <UserDropDown companyHeader={companyHeader} />
          </div>
        )}

        {/*  Always visible */}
        <LanguageToggle />

        {/*  Mobile Notifications */}
        {!isLoading && isAuthed && (
          <Button
            variant="outline"
            className="border-border relative h-8 w-8 md:hidden"
            size="icon-circle"
            aria-label={tHeader("notifications")}
          >
            <Image
              src="/assets/icons/notification.svg"
              width={14}
              height={14}
              alt="Notification Icon"
            />

            <span className="bg-primary absolute top-0 right-0 flex h-3 w-3 items-center justify-center rounded-full px-1 text-[8px] font-bold text-white">
              3
            </span>
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
            {tHeader("forEmployerCta")} <ChevronRight size={24} className="rtl-flip" />
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
