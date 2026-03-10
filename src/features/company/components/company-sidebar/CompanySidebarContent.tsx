import AccountUnderReview from "./AccountUnderReview";
import CompleteDetails from "./CompleteDetails";
import SidebarLinks from "./SidebarLinks";
import { Button } from "@/shared/components/ui/button";

const CompanySidebarContent = () => {
  return (
    <aside className="flex flex-col gap-4 pt-6 pb-2 px-3
      w-[300px] h-[calc(100vh-87px)] bg-white"
    >
      <AccountUnderReview />
      <CompleteDetails />
      <SidebarLinks />
      <Button className="mt-auto hover:bg-primary/70 rounded-full py-6 text-base">
        Post a Job
      </Button>
    </aside>
  );
};

export default CompanySidebarContent;