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
  const t = useTranslations("Candidate");
  const displayName = profile?.name || t("candidate");
  const displayImage = profile?.image || "/assets/profile_image.svg";
  const displayJobTitle = profile?.jobTitle || t("candidateAccount");
  const displayEmail = profile?.email || "-";
  const displayLocation = profile?.location || "-";
  const displayPhone = profile?.fullPhone || "-";
  const displayAge = profile?.age ? String(profile.age) : "-";
  const displayExp = profile?.experience || "-";

  return (
    <aside className="no-scrollbar flex flex-col gap-5  overflow-y-auto rounded-2xl bg-white px-3 py-6 shadow">
      {/* image */}
      <section className="mx-auto flex w-50 flex-col items-center justify-center gap-2">
        <Image
          src={displayImage}
          alt="profile image"
          width={150}
          height={150}
          className="rounded-full"
        />
        <h2 className="mt-1 text-xl font-semibold text-black">
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
            <span className="text-sm font-semibold">{t("hiringReadiness")}</span>
          </div>
          <span className="text-primary">85%</span>
        </div>
        <Progress value={60} />
        <div className="flex items-center gap-2">
          <CircleAlert className="text-primary h-4 w-4" />
          <span className="text-muted-foreground max-w-62 text-[12px]">
            {t("readinessHint")}
          </span>
        </div>
      </section>

      {/* progress */}
      <section className="my-2 flex flex-col lg:my-3 lg:gap-y-4">
        <div className="flex items-center justify-between p-2">
          <h6 className="text-muted-foreground text-sm font-semibold">
            {" "}
            {t("email")}
          </h6>
          <span className="text-sm font-semibold">{displayEmail}</span>
        </div>
        <div className="flex items-center justify-between p-2">
          <h6 className="text-muted-foreground text-sm font-semibold">
            {" "}
            {t("location")}
          </h6>
          <span className="text-sm font-semibold">{displayLocation}</span>
        </div>
        <div className="flex items-center justify-between p-2">
          <h6 className="text-muted-foreground text-sm font-semibold">{t("phone")}</h6>
          <span className="text-sm font-semibold">{displayPhone}</span>
        </div>
        <div className="flex items-center justify-between p-2">
          <h6 className="text-muted-foreground text-sm font-semibold">
            {" "}
            {t("experience")}
          </h6>
          <span className="text-sm font-semibold">{displayExp}</span>
        </div>
        <div className="flex items-center justify-between p-2">
          <h6 className="text-muted-foreground text-sm font-semibold">{t("age")}</h6>
          <span className="text-sm font-semibold">{displayAge}</span>
        </div>
      </section>

      {/* upload cv */}
      <UploadCvSection cvUrl={profile?.cv ?? null} />
    </aside>
  );
};

export default SideContentInfos;
