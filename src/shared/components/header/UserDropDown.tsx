"use client";

import useGetCandidateProfile from "@/features/candidate-profile/hooks/useGetCandidateProfile";
import useGetCompanyProfile from "@/features/company-profile/hooks/useGetCompanyProfile";
import {
  Bookmark,
  ChevronDown,
  Gauge,
  LogOut,
  Settings,
  UserRoundCogIcon,
} from "lucide-react";
import Image from "next/image";
import { Button, buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/utils";
import { useState } from "react";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useSession } from "next-auth/react";

function getSafeImageSrc(value: unknown, fallback = "/avatar.jpg") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export default function UserDropDown({
  companyHeader,
}: {
  companyHeader: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { logout } = useLogout();
  const { data: session } = useSession();
  const toggleOpen = () => setOpen((prev) => !prev);

  const isEmployer = session?.authRole === "employer" || companyHeader;
  const token = session?.accessToken || "";
  console.log("token::", token, isEmployer);

  const { data: companyProfileData } = useGetCompanyProfile({
    token: isEmployer ? token : "",
  });
  const { data: candidateProfileData } = useGetCandidateProfile({
    token: !isEmployer ? token : "",
  });
  console.log("candidateProfileData::", candidateProfileData);

  const profileHref = isEmployer
    ? "/company/company-profile"
    : "/candidate/profile";
  const displayName = session?.user?.name || "User";
  const subtitle = isEmployer
    ? "Company account"
    : "Candidate account";
  const imageSrc = getSafeImageSrc(
    (isEmployer ? companyProfileData?.image : candidateProfileData?.image) ??
      session?.user?.image,
  );
  const itemClass =
    "group cursor-pointer  flex items-center gap-2 text-md font-semibold text-muted-foreground " +
    "bg-transparent hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent " +
    "hover:text-primary focus:text-primary transition-colors";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-border group relative h-13.75 w-13.75 rounded-full"
        >
          <Image
            src={imageSrc}
            alt="User Avatar"
            fill
            className="rounded-full "
          />{" "}
          <span className="border-border absolute -right-3 -bottom-2 flex h-6 w-6 items-center justify-center rounded-full border bg-white">
            <ChevronDown
              size={20}
              strokeWidth={1.25}
              className="transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180"
            />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-62" align="start">
        {/* Profile Section */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex cursor-default flex-col gap-2 bg-transparent hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent">
            <div className="flex w-full items-center gap-2">
              <Image
                src={imageSrc}
                alt="Profile"
                width={60}
                height={60}
                className="rounded-full h-13.75 w-13.75"
              />
              <div>
                <p className="text-lg font-semibold text-black">{displayName}</p>
                <p className="text-md text-muted-foreground font-normal">
                  {subtitle}
                </p>
              </div>
            </div>

            <Link
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "pill",
                  hoverStyle: "slidePrimary",
                }),
                "border-secondary h-8.5 w-full border",
              )}
              href={profileHref}
              onClick={() => toggleOpen()}
            >
              View Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuGroup>
          <DropdownMenuItem className={itemClass}>
            <Settings
              className="text-muted-foreground group-hover:text-primary h-5 w-5"
              strokeWidth={2.5}
            />
            <Link
              href={
                isEmployer
                  ? "/company/account-settings/basic-info"
                  : "/candidate/settings/basic-info"
              }
              onClick={() => toggleOpen()}
            >
              Account settings
            </Link>
          </DropdownMenuItem>

          {isEmployer ? (
            <>
              <DropdownMenuItem className={itemClass}>
                <Gauge
                  className="text-muted-foreground group-hover:text-primary h-5 w-5"
                  strokeWidth={2.5}
                />
                <Link href={"/company/dashboard"} onClick={() => toggleOpen()}>
                  Dashboard
                </Link>{" "}
              </DropdownMenuItem>
              <DropdownMenuItem className={itemClass}>
                <UserRoundCogIcon
                  className="text-muted-foreground group-hover:text-primary h-5 w-5"
                  strokeWidth={2.5}
                />
                <Link
                  href={"/company/job-management"}
                  onClick={() => toggleOpen()}
                >
                  Job Management
                </Link>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem className={itemClass}>
              <Bookmark
                className="text-muted-foreground group-hover:text-primary"
                strokeWidth={2.5}
              />
              <Link href={"/jobs/saved"} onClick={() => toggleOpen()}>
                Saved
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="group text-md text-destructive hover:text-destructive/80 flex cursor-pointer items-center gap-2 bg-transparent font-semibold transition-colors hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent"
            onClick={async () => {
              toggleOpen();
              await logout();
            }}
          >
            <LogOut className="text-destructive group-hover:text-destructive/80 h-5 w-5 transition-colors" />
            <p className="text-destructive group-hover:text-destructive/80">
              Log out
            </p>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
