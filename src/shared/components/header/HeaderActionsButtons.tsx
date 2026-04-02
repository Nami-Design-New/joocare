"use client";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LanguageToggle } from "../LanguageToggle";
import { Button, buttonVariants } from "../ui/button";
import UserDropDown from "./UserDropDown";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { DrawerScrollableContent } from "./DrawerScrollableContent";

function HeaderActionsButtons({
  isAuthed,
  companyHeader,
}: {
  isAuthed: boolean;
  companyHeader: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="flex items-center justify-center space-x-0 lg:space-x-4"
        role="region"
        aria-label="User Actions"
      >
        {/* <Button variant="outline" size="icon-circle" aria-label="Search">
        <Search />
      </Button> */}

        {!isAuthed && (
          <>
            {" "}
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
            </Button>{" "}
          </>
        )}
        {isAuthed && (
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

              {/* Badge with number */}
              <span className="bg-primary absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full px-1 text-xs font-bold text-white">
                3
              </span>
            </Button>
            <UserDropDown companyHeader={companyHeader} />{" "}
          </div>
        )}
        <LanguageToggle aria-label="Toggle Language" />
        {isAuthed && (
          <Button
            variant="outline"
            className="border-border relative h-8 w-8 md:hidden"
            size="icon-circle"
            aria-label="Notifications"
          >
            <Image
              src="/assets/icons/notification.svg"
              width={14}
              height={14}
              alt="Notification Icon"
            />
            {/* <Bell className="w-3 h-3" size={12} /> */}

            {/* Badge with number */}
            <span className="bg-primary absolute top-0 right-0 flex h-3 w-3 items-center justify-center rounded-full px-1 text-[8px] font-bold text-white">
              3
            </span>
          </Button>
        )}
        {!isAuthed && (
          <Link
            href="/employer"
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
