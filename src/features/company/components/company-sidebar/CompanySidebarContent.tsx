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
    <aside className="no-scrollbar flex flex-col gap-4 overflow-y-auto bg-white px-3 py-6 lg:h-[calc(100vh-87px)]">
      <div className="order-2 flex flex-col gap-4 lg:order-1">
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

      <PostJobCard canPostJob={companyProfileData?.status === "Approved"} />
    </aside>
  );
};

export default CompanySidebarContent;
