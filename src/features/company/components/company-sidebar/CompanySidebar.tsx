"use client";

import { Button } from "@/shared/components/ui/button";
import AccountUnderReview from "./AccountUnderReview";
import CompleteDetails from "./CompleteDetails";
import SidebarLinks from "./SidebarLinks";
import { ClosedCaption, Menu } from "lucide-react";

interface Props {
  open: boolean;
  closeSidebar?: () => void;
  setOpen: (open: boolean) => void;
}

const CompanySidebar = ({ open, closeSidebar, setOpen }: Props) => {
  return (
    <>
      {/* overlay */}
      <div
        onClick={closeSidebar}
        className={`fixed inset-0 bg-black/40  transition-opacity duration-300
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      <aside
        aria-labelledby="company-sidebar"
        className={`flex flex-col gap-4 pt-12 px-3 fixed md:sticky top-[87px] left-0 z-50  w-75 h-[calc(100vh-87px)] transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        bg-white`}
      >
        <AccountUnderReview />
        <CompleteDetails />
        <SidebarLinks />
        <Button className="hover:bg-primary/70 rounded-full py-6 text-base">Post a Job</Button>

        {/* <button
          className="md:hidden p-4  left-0"
          onClick={() => setOpen(!open)}
        >
          {open ? <Menu /> : <ClosedCaption />}
        </button> */}
      </aside>

    </>
  );
};

export default CompanySidebar;