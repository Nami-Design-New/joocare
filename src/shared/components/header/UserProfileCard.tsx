"use client";

import { Link } from "@/i18n/navigation";
import {
  ArrowUpRight,
  Bookmark,
  Gauge,
  Settings,
  UserRoundCogIcon,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useSession } from "next-auth/react";

export default function UserProfileCard({
  companyHeader,
}: {
  companyHeader: boolean;
}) {
  const { logout } = useLogout();
  const { data: session } = useSession();
  const isEmployer = session?.authRole === "employer" || companyHeader;
  const profileHref = isEmployer
    ? "/company/company-profile"
    : "/candidate/profile";
  const settingsHref = isEmployer
    ? "/company/account-settings/basic-info"
    : "/candidate/settings/basic-info";
  const displayName = session?.user?.name || "User";
  const subtitle = isEmployer
    ? "Company account"
    : "Candidate account";
  const imageSrc = session?.user?.image || "/profile-placeholder.svg";
  const itemClass =
    "group cursor-pointer  flex items-center gap-2 text-md font-semibold text-muted-foreground " +
    "bg-transparent hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent " +
    "hover:text-primary focus:text-primary transition-colors";
  return (
    <section className="w-full">
      <div className="flex w-full items-center gap-2 p-2">
        <Image
          src={imageSrc}
          alt="Profile"
          width={60}
          height={60}
          className="rounded-full"
        />
        <div>
          <p className="text-md font-semibold text-black">{displayName}</p>
          <p className="text-md text-muted-foreground font-normal">{subtitle}</p>
          <Link
            href={profileHref}
            className="text-secondary text-normal flex items-center gap-1 font-normal"
          >
            View Profile <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
      <ul className="flex flex-col gap-2 p-2">
        <li className={itemClass}>
          <Settings className="text-muted-foreground group-hover:text-muted-foreground h-5 w-5" />
          <Link href={settingsHref}>Account settings</Link>
        </li>
        {isEmployer ? (
          <>
            <li className={itemClass}>
              <Gauge
                className="text-muted-foreground group-hover:text-primary h-5 w-5"
                strokeWidth={2.5}
              />
              <Link href="/company/dashboard">Dashboard</Link>
            </li>
            <li className={itemClass}>
              <UserRoundCogIcon
                className="text-muted-foreground group-hover:text-primary h-5 w-5"
                strokeWidth={2.5}
              />
              <Link href="/company/job-management">Job Management</Link>
            </li>
          </>
        ) : (
          <li className={itemClass}>
            <Bookmark className="text-muted-foreground group-hover:text-muted-foreground h-5 w-5" />
            <Link href="/jobs/saved">Saved</Link>
          </li>
        )}
      </ul>
      <Button
        size="pill"
        variant="destructive"
        className="bg-destructive mt-4 w-full text-white"
        onClick={logout}
      >
        Log out
      </Button>
    </section>
  );
}
