"use client";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/shared/components/ui/button";
import AccountUnderReview from "./AccountUnderReview";
import CompleteDetails from "./CompleteDetails";
import SidebarLinks from "../../../../shared/components/SidebarLinks";
import { links } from "../../constants";


const CompanySidebarContent = () => {
  return (
    <aside className="no-scrollbar flex lg:h-[calc(100vh-87px)]  flex-col gap-4 overflow-y-auto bg-white px-3 pt-6 pb-2">
      <div className="flex flex-col gap-4 order-2 lg:order-1">

        <AccountUnderReview />
        <CompleteDetails />
      </div>
      <div className="order-1 lg:order-2">
        <SidebarLinks links={links} />
      </div>
      <Link
        href="/company/post-job"
        className={`${buttonVariants({ variant: "default", size: "pill" })} hover:bg-primary/70 mt-auto rounded-full py-6 text-base order-3 `}
      >
        Post a Job
      </Link>
    </aside>
  );
};

export default CompanySidebarContent;
