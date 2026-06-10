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
import { useTranslations } from "next-intl";
import useGetCompanyProfile from "@/features/company-profile/hooks/useGetCompanyProfile";
import useGetCandidateProfile from "@/features/candidate-profile/hooks/useGetCandidateProfile";
import { getSafeImageSrc } from "./UserDropDown";

export default function UserProfileCard({
  companyHeader,
  setToggleSideMenu
}: {
  companyHeader: boolean;
  setToggleSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const t = useTranslations();
  const { logout } = useLogout();
  const { data: session } = useSession();
  const isEmployer = session?.authRole === "employer" || companyHeader;

  const token = session?.accessToken || "";

  const { data: companyProfileData } = useGetCompanyProfile({
    token: isEmployer ? token : "",
  });
  const { data: candidateProfileData } = useGetCandidateProfile({
    token: !isEmployer ? token : "",
  });

  const profileHref = isEmployer
    ? "/company/company-profile"
    : "/candidate/profile";
  const settingsHref = isEmployer
    ? "/company/account-settings/basic-info"
    : "/candidate/settings/basic-info";
  const displayName =
    (isEmployer
      ? companyProfileData?.name || t("header.user")
      : candidateProfileData?.name) || t("header.user");

  const subtitle = isEmployer
    ? t("header.company-account")
    : t("header.candidate-account");


  const fallbackImage = isEmployer
    ? "/assets/new-logo-dot.svg"
    : "/assets/profile_image.svg";

  const imageSrc = getSafeImageSrc(
    (isEmployer ? (companyProfileData?.image ? companyProfileData?.image : '/assets/new-logo-dot.svg') : (candidateProfileData?.image ? candidateProfileData?.image : '/assets/profile_image.svg')) ??
    session?.user?.image,
    fallbackImage
  );

  const itemClass =
    "group cursor-pointer  flex items-center gap-2 text-base font-semibold text-muted-foreground " +
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
          className="rounded-full h-14 w-14"
        />
        <div>
          <p className="text-base font-semibold text-black">{displayName as string}</p>
          <p className="text-base text-muted-foreground font-normal">{subtitle}</p>
          <Link
            href={profileHref}
            className="text-secondary text-normal flex items-center gap-1 font-normal"
            onClick={() => setToggleSideMenu(false)}
          >
            {t("header.view-profile")} <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
      <ul className="flex flex-col gap-2 p-2">
        <li className={itemClass}>
          <Settings className="text-muted-foreground group-hover:text-muted-foreground h-5 w-5" />
          <Link
            onClick={() => setToggleSideMenu(false)}
            href={settingsHref}>{t("header.account-settings")}</Link>
        </li>
        {isEmployer ? (
          <>
            <li className={itemClass}>
              <Gauge
                className="text-muted-foreground group-hover:text-primary h-5 w-5"
                strokeWidth={2.5}
              />
              <Link
                onClick={() => setToggleSideMenu(false)}
                href="/company/dashboard">{t("header.dashboard")}</Link>
            </li>
            <li className={itemClass}>
              <UserRoundCogIcon
                className="text-muted-foreground group-hover:text-primary h-5 w-5"
                strokeWidth={2.5}
              />
              <Link
                onClick={() => setToggleSideMenu(false)}
                href="/company/job-management">{t("header.job-management")}</Link>
            </li>
          </>
        ) : (
          <li className={itemClass}>
            <Bookmark className="text-muted-foreground group-hover:text-muted-foreground h-5 w-5" />
            <Link
              onClick={() => setToggleSideMenu(false)}
              href="/jobs/saved">{t("header.saved")}</Link>
          </li>
        )}
      </ul>
      <Button
        size="pill"
        variant="destructive"
        className="bg-destructive mt-4 w-full text-white"
        onClick={() => {
          setToggleSideMenu(false);
          logout();
        }}
      >
        {t("header.log-out")}
      </Button>
    </section>
  );
}
