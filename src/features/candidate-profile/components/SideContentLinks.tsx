"use client";

import SidebarLinks from "@/shared/components/SidebarLinks";
import { links } from "../constants";

const CandidateSideContentLinks = () => {
  return (
    <aside className="no-scrollbar flex flex-col gap-2 overflow-y-auto rounded-2xl bg-white px-3 py-6 shadow lg:min-h-dvh lg:gap-5">
      <SidebarLinks links={links} />

      <section className="mt-2 flex flex-col gap-3 rounded-2xl bg-[#DC26260D] px-4 py-3 lg:mt-auto">
        <h3 className="text-destructive text-xl font-semibold">
          Please complete your details.
        </h3>
        <p className="text-muted-foreground text-base">
          Please complete your account details so you can use the platform
          normally and benefit from all its features.
        </p>
      </section>
    </aside>
  );
};

export default CandidateSideContentLinks;
