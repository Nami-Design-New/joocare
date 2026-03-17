import { Link } from "@/i18n/navigation";
import AccountUnderReview from "./AccountUnderReview";
import CompleteDetails from "./CompleteDetails";
import SidebarLinks from "./SidebarLinks";
import { Button, buttonVariants } from "@/shared/components/ui/button";

const CompanySidebarContent = () => {
  return (
    <aside className="no-scrollbar flex h-[calc(100vh-87px)] w-[300px] flex-col gap-4 overflow-y-auto bg-white px-3 pt-6 pb-2">
      <AccountUnderReview />
      <CompleteDetails />
      <SidebarLinks />
      <Link
        href="/company/post-job"
        className={`${buttonVariants({ variant: "default", size: "pill" })} hover:bg-primary/70 mt-auto rounded-full py-6 text-base`}
      >
        Post a Job
      </Link>
    </aside>
  );
};

export default CompanySidebarContent;
