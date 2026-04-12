"use client";

import SidebarLinks from "@/shared/components/SidebarLinks";
import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";

const CandidateSideContentLinks = ({ isCompleted }: { isCompleted?: boolean | null }) => {
  const t = useTranslations("Candidate");
  const links = [
    {
      label: t("myProfile"),
      href: "/candidate/profile",
      image: "/assets/icons/profile.svg",
    },
    {
      label: t("applications"),
      href: "/candidate/applications",
      image: "/assets/icons/application.svg",
    },
    {
      label: t("professionalCredentials"),
      href: "/candidate/credentials/qualifications",
      image: "/assets/icons/professional_credentials.svg",
    },
    {
      label: t("profileSettings"),
      href: "/candidate/settings/basic-info",
      icon: Settings,
    },
  ];
  return (
    <aside className="no-scrollbar flex flex-col gap-2 overflow-y-auto rounded-2xl bg-white px-3 py-6 shadow lg:min-h-dvh lg:gap-5">
      <SidebarLinks links={links} />

      {!isCompleted && <section className="mt-2 flex flex-col gap-3 rounded-2xl bg-[#DC26260D] px-4 py-3 lg:mt-auto">
        <h3 className="text-destructive text-xl font-semibold">
          {t("completeDetailsTitle")}
        </h3>
        <p className="text-muted-foreground text-base">
          {t("completeDetailsDescription")}
        </p>

      </section>
      }
    </aside>
  );
};

export default CandidateSideContentLinks;
