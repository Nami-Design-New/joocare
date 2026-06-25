"use client";

import { Progress } from "@/shared/components/ui/progress";
import { CircleAlert, Sparkles } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import UploadCvSection from "./UploadCvSection";
import type { CandidateProfileViewModel } from "../types/profile.types";

const SideContentInfos = ({
  profile,
}: {
  profile: CandidateProfileViewModel | null;
}) => {
  const t = useTranslations();
  const displayName = profile?.name || t("candidatePage.profile.candidate");
  const displayImage = profile?.image || "/assets/profile_image.svg";
  const displayJobTitle = profile?.jobTitle || t("candidatePage.profile.candidate-account");
  const displayEmail = profile?.email || "-";
  const displayLocation = profile?.location || "-";
  const displayPhone = profile?.fullPhone || "-";
  const displayAge = profile?.age ? String(profile.age) : "-";
  const displayExp = profile?.experience || "-";
  const hiringReadiness = profile?.hiring_readiness_score;
  const readinessScore = profile?.hiring_readiness_score ?? 0;
  console.log("profile::::", profile);

  return (
    <aside className="no-scrollbar flex flex-col gap-5  overflow-y-auto rounded-2xl bg-white px-3 py-6 shadow">
      {/* image */}
      <section className="mx-auto flex w-50 flex-col items-center justify-center gap-2">
        <Image
          src={displayImage}
          alt={t("candidatePage.profile.profile-image")}
          width={150}
          height={150}
          className="rounded-full h-37.5 w-37.5"
        />
        <h2 className="mt-1 text-[21px] font-semibold text-black">
          {displayName}
        </h2>
        <span className="text-primary text-sm font-semibold">
          {displayJobTitle}
        </span>
      </section>

      {/* progress */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="text-primary h-4 w-4" />
            <span className="text-sm font-semibold">{t("candidatePage.profile.hiring-readiness")}</span>
          </div>
          <span className="text-primary">{hiringReadiness}%</span>
        </div>
        <Progress value={hiringReadiness} />
        {profile?.hiring_readiness_score === 0 && (
          <div className="flex items-center gap-2">
            <CircleAlert className="text-primary h-4 w-4" />
            <span className="text-muted-foreground max-w-62 text-[12px] flex flex-wrap">
              {t("candidatePage.profile.hiring-readiness-help")}
            </span>
          </div>
        )}
        {(readinessScore > 0 && readinessScore < 100) && (
          <div className="flex items-center gap-2">
            <CircleAlert className="text-primary h-4 w-4" />
            <span className="text-muted-foreground max-w-62 text-[12px] flex flex-wrap">
              {t('candidatePage.profile.missing-score-items')}{profile?.missing_score_items.map((item, index) => <span className="mx-0.5" key={index}>{item}</span>)}            </span>
          </div>
        )}
      </section>

      {/* progress */}
      <section className="my-2 flex flex-col lg:my-3 lg:gap-y-4">
        <div className="flex items-center justify-between p-2">
          <h6 className="text-muted-foreground text-sm font-semibold">
            {" "}
            {t("authPage.common.email")}{" "}
          </h6>
          <span className="text-sm font-semibold">{displayEmail}</span>
        </div>
        <div className="flex items-center justify-between p-2">
          <h6 className="text-muted-foreground text-sm font-semibold">
            {" "}
            {t("candidatePage.profile.location")}{" "}
          </h6>
          <span className="text-sm font-semibold">{displayLocation}</span>
        </div>
        <div className="flex items-center justify-between p-2">
          <h6 className="text-muted-foreground text-sm font-semibold">{t("candidatePage.profile.phone")}</h6>
          <span className="text-sm font-semibold">{displayPhone}</span>
        </div>
        <div className="flex items-center justify-between p-2">
          <h6 className="text-muted-foreground text-sm font-semibold">
            {" "}
            {t("candidatePage.profile.experience")}{" "}
          </h6>
          <span className="text-sm font-semibold">{displayExp}</span>
        </div>
        <div className="flex items-center justify-between p-2">
          <h6 className="text-muted-foreground text-sm font-semibold">{t("candidatePage.profile.age")}</h6>
          <span className="text-sm font-semibold">{displayAge}</span>
        </div>
      </section>

      {/* upload cv */}
      <UploadCvSection cvUrl={profile?.cv ?? null} />
    </aside>
  );
};

export default SideContentInfos;
