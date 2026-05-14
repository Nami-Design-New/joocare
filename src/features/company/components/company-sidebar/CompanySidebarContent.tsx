"use client";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/shared/components/ui/button";
import AccountUnderReview from "./AccountUnderReview";
import CompleteDetails from "./CompleteDetails";
import SidebarLinks from "../../../../shared/components/SidebarLinks";
import { links } from "../../constants";
import { useSession } from "next-auth/react";
import useGetCompanyProfile from "@/features/company-profile/hooks/useGetCompanyProfile";
import { useTranslations } from "next-intl";


const CompanySidebarContent = () => {
  const t = useTranslations();
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  const { data: companyProfileData, isPending } = useGetCompanyProfile({ token });
  // console.log(companyProfileData);
  const translatedLinks = links.map((link) => ({
    ...link,
    label: t(link.label),
  }));

  return (
    <aside className="no-scrollbar flex lg:h-[calc(100vh-87px)]  flex-col gap-4 overflow-y-auto bg-white px-3 pt-6 pb-2">
      <div className="flex flex-col gap-4 order-2 lg:order-1">
        {companyProfileData?.status === "Pending" && (
          <AccountUnderReview companyProfileData={companyProfileData} />
        )}
        {companyProfileData?.status === "Rejected" && (
          <AccountUnderReview companyProfileData={companyProfileData} />
        )}
        {companyProfileData?.status === "Draft" && (
          <CompleteDetails />
        )}
      </div>
      <div className="order-1 lg:order-2">
        <SidebarLinks links={translatedLinks} companyProfileData={companyProfileData} />
      </div>

      <div className="relative group mt-auto order-3 ">
        <Link
          href="/company/post-job"
          className={`${buttonVariants({ variant: "default", size: "pill" })} 
    hover:bg-primary/70 rounded-full py-6 text-base w-full
    ${companyProfileData?.status !== "Approved" ? "pointer-events-none opacity-50" : ""}`}
        >
          {t("companyPage.sidebar.post-job")}
        </Link>

        {companyProfileData?.status !== "Approved" && (
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
      whitespace-nowrap rounded bg-black text-white text-xs px-3 py-1 
      opacity-0 group-hover:opacity-100 transition">
            {t("companyPage.sidebar.post-job-tooltip-line-1")} <br /> {t("companyPage.sidebar.post-job-tooltip-line-2")}
          </span>
        )}
      </div>
    </aside>
  );
};

export default CompanySidebarContent;
