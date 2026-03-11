"use client";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LanguageToggle } from "../LanguageToggle";
import { Button, buttonVariants } from "../ui/button";
import UserDropDown from "./UserDropDown";
import { Link } from "@/i18n/navigation";

function HeaderActionsButtons({ isAuthed, companyHeader }: { isAuthed: boolean, companyHeader: boolean }) {
  const router = useRouter();

  return (
    <div
      className="flex justify-center items-center space-x-0 lg:space-x-4"
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
        <div className=" items-center gap-4  hidden md:flex">
          <Button
            variant="outline"
            className="border-border  relative"
            size="icon-circle"
            aria-label="Notifications"
          >
            <Image
              src="/assets/icons/notification.svg"
              width={24}
              height={24}
              alt="Notification Icon"
            />

            {/* Badge with number */}
            <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
              3
            </span>
          </Button>
          <UserDropDown  companyHeader={companyHeader} />{" "}
        </div>
      )}
      <LanguageToggle aria-label="Toggle Language" />
      {isAuthed && (
        <Button
          variant="outline"
          className="border-border   lg:hidden relative w-8 h-8"
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
          <span className="absolute top-0 right-0 w-3 h-3 bg-primary text-white text-[8px] font-bold rounded-full flex items-center justify-center px-1">
            3
          </span>
        </Button>
      )}
      {!isAuthed && (
        <Link
          href="/employer"
          className={`flex items-center text-lg text-secondary justify-center ${buttonVariants(
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
  );
}

export default HeaderActionsButtons;
