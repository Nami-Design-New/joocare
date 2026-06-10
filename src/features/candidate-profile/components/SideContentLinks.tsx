"use client";

import SidebarLinks from "@/shared/components/SidebarLinks";
import { links } from "../constants";
import { useTranslations } from "next-intl";

const CandidateSideContentLinks = ({ isCompleted }: { isCompleted?: boolean | null }) => {
  const t = useTranslations();
  const translatedLinks = links.map((link) => ({
    ...link,
    label: t(link.label),
  }));

  return (
    <aside className="no-scrollbar flex h-full flex-col gap-2 overflow-y-auto rounded-2xl bg-white px-3 py-6 shadow lg:min-h-[calc(100dvh-150px)] lg:gap-5">
      <SidebarLinks links={translatedLinks} />

      {!isCompleted && <section className="mt-2 flex flex-col gap-3 rounded-2xl bg-[#DC26260D] px-4 py-3 lg:mt-auto">
        <h3 className="text-destructive text-lg md:text-xl font-semibold">
          {t("candidatePage.sidebar.complete-details-title")}
        </h3>
        <p className="text-muted-foreground text-sm md:text-base">
          {t("candidatePage.sidebar.complete-details-description")}
        </p>

      </section>
      }
    </aside>
  );
};

export default CandidateSideContentLinks;
