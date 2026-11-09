"use client";

import AccountUnderReview from "./AccountUnderReview";
import CompleteDetails from "./CompleteDetails";
import PostJobCard from "./PostJobCard";
import SidebarNav from "@/shared/components/sidebar-nav/SidebarNav";
import { getCompanySidebarGroups } from "../../constants";
import { useSession } from "next-auth/react";
import useGetCompanyProfile from "@/features/company-profile/hooks/useGetCompanyProfile";

const CompanySidebarContent = () => {
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  const { data: companyProfileData } = useGetCompanyProfile({ token });
  const groups = getCompanySidebarGroups(companyProfileData?.status);

  return (
    <aside className="no-scrollbar flex flex-col gap-4 overflow-y-auto rounded-2xl bg-white px-3 py-6 shadow lg:h-[calc(100vh-87px)] lg:rounded-none lg:shadow-none">
      <div className="order-2 flex flex-col gap-4 empty:hidden lg:order-1">
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
        <SidebarNav groups={groups} />
      </div>

      {/* Desktop only: on mobile the sidebar is just the pills row (+ account status). */}
      <div className="hidden lg:contents">
        <PostJobCard canPostJob={companyProfileData?.status === "Approved"} />
      </div>
    </aside>
  );
};

export default CompanySidebarContent;
