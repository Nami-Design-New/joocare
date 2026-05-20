"use client"
import { JobListItem } from "@/features/jobs/types/jobs.types";
import {
  getJobLocation,
  getJobSalaryWithCurrency
} from "@/features/jobs/utils";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CircleDollarSign,
  MapPin,
  Share
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useJobShare } from "../../hooks/useJobShare";
import ToggleSavedJobButton from "./ToggleSavedJobButton";
import { htmlToText } from "@/shared/lib/truncateHtml";

type CandidateJobCardProps = {
  job: JobListItem;
  href?: string;
  appliedBadge?: boolean;
  appliedAtLabel?: string;
  onSavedChange?: (nextSavedState: boolean) => void;
  companyImage?: string;
};

export default function CandidateJobCard({
  job,
  href = "/jobs",
  appliedBadge,
  appliedAtLabel,
  onSavedChange,
  companyImage
}: CandidateJobCardProps) {
  const t = useTranslations();
  const locale = useLocale()
  const { data: session } = useSession();
  const title = job.title || job.job_title?.title || t("jobsPage.healthcare-opportunity");
  const sharePath = `/jobs/${job.id}`;
  const company = job.company?.name || t("jobsPage.joocare-employer");
  const companyLogo = job.company?.image;
  const postedAtLabel = job?.current_status?.updated_at;
  const location = getJobLocation(job, t("jobsPage.location-not-specified"));
  const category = job?.category?.title || job?.category_title || t("jobsPage.not-specified");
  const employmentType = job?.employment_type?.title || t("jobsPage.not-specified");
  const salary = getJobSalaryWithCurrency(job, t("jobsPage.not-specified"));
  const experience = job?.experience?.title || job?.experience_title || t("jobsPage.experience-not-specified");
  const specialty = job?.specialty?.title || job?.specialty_title || t("jobsPage.healthcare");
  // const excerpt =
  //   job.description?.slice(0, 70) || t("jobsPage.card-description-fallback");
  const plainDescription = htmlToText(job.description || "");

  const excerpt =
    plainDescription.slice(0, 70) ||
    t("jobsPage.card-description-fallback");

  const shouldShowAppliedBadge = appliedBadge || job.is_applied;
  const appliedLabel = appliedAtLabel || postedAtLabel;
  const { shareJob } = useJobShare({ title, path: sharePath });
  const isEmployer = session?.authRole === "employer";
  const router = useRouter();

  return (
    <Card className="group hover:border-primary shadow-xl">
      <CardHeader className="flex gap-2 max-lg:px-2">
        <Image
          width={52}
          height={46}
          src={companyLogo || companyImage || "/assets/new-logo-dot.svg"}
          alt={`${company} logo`}
          className="rounded-2xl w-14 h-12"

        />
        <div className="flex grow flex-col gap-1">
          <h6 onClick={() => router.push(href)} className="text-secondary text-lg font-semibold group-hover:text-primary cursor-pointer">
            {title}
          </h6>
          <p className="text-foreground text-md font-normal">{company}</p>
          <time className="text-muted-foreground text-xs font-normal">
            {postedAtLabel}
          </time>
        </div>
        {/* <p className="text-[12px]">{domain}</p> */}
      </CardHeader>
      <CardContent className="max-lg:px-2 grow">
        <div className=" flex flex-col gap-4  ">
          <ul className="items-start flex gap-2">
            <li className="text-secondary flex items-start gap-1 text-sm font-normal">
              <MapPin size={16} color="var(--muted-foreground)" className="shrink-0" />
              {location}
            </li>
            <li className="text-secondary flex items-start gap-1 text-sm font-normal">
              <Briefcase size={16} color="var(--muted-foreground)" className="shrink-0" />
              {category}
            </li>
            <li className="text-secondary flex items-start gap-1 text-sm font-normal">
              <CircleDollarSign size={16} color="var(--muted-foreground)" className="shrink-0" />
              {salary}
            </li>
          </ul>
          <ul className="items-cente flex gap-2">
            <li className="text-muted-foreground bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs font-normal">
              {experience}
            </li>
            <li className="text-muted-foreground bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs font-normal">
              {employmentType}
            </li>
            <li className="text-muted-foreground bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs font-normal">
              {specialty}
            </li>
          </ul>
          {/* <p className="text-muted-foreground grow h-auto text-sm">{excerpt}</p> */}
          {/* <div
            className="prose prose-sm max-w-none mt-3"
            dangerouslySetInnerHTML={{
              __html:
                excerpt ||
                `<p>${t("jobsPage.no-description-available")}</p>`,
            }}
          /> */}
          <div className="prose prose-sm max-w-none mt-3">
            {excerpt || t("jobsPage.no-description-available")}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4  max-lg:px-2">
        <div className="flex w-full items-center justify-between gap-2 border-b-border border-t pt-4 flex-wrap">
          <div className="flex gap-2">
            {!isEmployer ? (
              <ToggleSavedJobButton
                jobId={job.id}
                initialIsSaved={job.is_saved}
                onSavedChange={onSavedChange}
                className="bg-muted"
              />
            ) : null}
            <Button
              variant="outline"
              size="pill"
              className="border-border text-muted-foreground h-9 px-4 py-2 text-sm bg-muted"
              onClick={() => void shareJob()}
            >
              <Share className="mx-1" /> {t("jobsPage.share")}
            </Button>
          </div>

          {shouldShowAppliedBadge ? (
            <Button
              className={`border-border bg-primary/10 flex h-9 items-center gap-2 rounded-full px-3 py-2 text-sm text-white cursor-default`}

            >
              <span className="text-primary font-semibold">{t("jobsPage.applied")}</span>
              <span className="grow text-end text-xs text-muted-foreground">{appliedLabel}</span>
            </Button>

          ) :
            <Link
              className={`border-border bg-primary flex h-9 items-center gap-2 rounded-full px-3 py-2 text-sm text-white`}
              href={href}
            >
              {t("jobsPage.view-job")}
              {locale === 'ar' ? (
                <ArrowLeft size={18} strokeWidth={1.5} className="size-5" />
              ) : (
                <ArrowRight size={18} strokeWidth={1.5} className="size-5" />
              )}
            </Link>
          }
        </div>
        {/* {shouldShowAppliedBadge && (
          <Badge
            variant="open"
            size="pill"
            className="flex w-full justify-start gap-1"
          >
            <Dot className="h-4 w-4" strokeWidth={12} /> <span>Applied</span>
            <span className="grow text-end text-xs text-muted-foreground">{appliedLabel}</span>
          </Badge>
        )} */}
      </CardFooter>
    </Card >
  );
}
