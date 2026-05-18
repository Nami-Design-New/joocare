"use client";

import React from "react";
import { JobFormData } from "../validation/job-post-schema";
import Image from "next/image";
import { Badge } from "@/shared/components/ui/badge";
import { JobDetails } from "../types/jobs.types";
import { getJobSalary } from "../utils";
import JobOverviewItem from "./JobOverviewItem";
import { useTranslations } from "next-intl";

type JobPreviewLabels = Partial<{
  title: string;
  employmentType: string;
  salaryType: string;
  currency: string;
  category: string;
  specialty: string;
  roleCategory: string;
  seniorityLevel: string;
  country: string;
  city: string;
  yearsOfExperience: string;
  educationLevel: string[];
  mandatoryCertifications: string[];
  availability: string;
  skills: string[];
}>;

type ReviewPreviewData = {
  title: string;
  employmentType: string;
  description: string;
  skills: string[];
  salary: string;
  currencyCode: string;
  salaryType: string;
  city: string;
  country: string;
  experience: string;
  category: string;
  specialty: string;
  roleCategory: string;
  seniorityLevel: string;
  educationLevels: string[];
  mandatoryCertifications: string[];
  availability: string;
};

type ReviewSidebarData = {
  salary: string;
  currencyCode: string;
  salaryType: string;
  city: string;
  country: string;
  experience: string;
  category: string;
  specialty: string;
  roleCategory: string;
  seniorityLevel: string;
  educationLevels: string[];
  mandatoryCertifications: string[];
  availability: string;
};

function toIdString(value: number | string | null | undefined) {
  return value == null ? "" : String(value);
}

function resolveNamedValue(
  selectedValue: string | undefined,
  entityId: number | null | undefined,
  entityTitle?: string | null,
) {
  if (!selectedValue) return entityTitle ?? "-";
  return selectedValue === toIdString(entityId) ? (entityTitle ?? "-") : selectedValue;
}

function resolveDisplayValue(
  previewValue: string | undefined,
  selectedValue: string | undefined,
  entityId: number | null | undefined,
  entityTitle?: string | null,
) {
  if (previewValue !== undefined) {
    return previewValue || "-";
  }

  return resolveNamedValue(selectedValue, entityId, entityTitle);
}

function resolveTitle(
  data: JobFormData,
  job: JobDetails | null,
  untitledJobLabel: string,
) {
  if (data.title === "__other__") {
    return data.otherJobTitle?.trim() || job?.title || untitledJobLabel;
  }

  if (data.title) {
    return data.title === toIdString(job?.job_title_id)
      ? (job?.job_title?.title ?? untitledJobLabel)
      : data.title;
  }

  return job?.title ?? job?.job_title?.title ?? untitledJobLabel;
}

function resolveCustomOrNamedValue(
  selectedValue: string | undefined,
  customValue: string | undefined,
  entityId: number | null | undefined,
  entityTitle?: string | null,
) {
  if (selectedValue === "__other__") {
    return customValue?.trim() || entityTitle || "-";
  }

  return resolveNamedValue(selectedValue, entityId, entityTitle);
}

function resolvePreviewString(
  previewValue: string | undefined,
  fallbackValue: string,
) {
  if (previewValue !== undefined) {
    return previewValue || "-";
  }

  return fallbackValue;
}

function buildEditPreviewData(
  data: JobFormData,
  job: JobDetails | null,
  previewLabels: JobPreviewLabels,
  labels: {
    untitledJob: string;
    notSpecified: string;
    noDescriptionHtml: string;
  },
): ReviewPreviewData {
  const resolvedTitle = resolveTitle(data, job, labels.untitledJob);
  const salary = data.addSalary
    ? getJobSalary({
      min_salary: data.salary?.min ?? null,
      max_salary: data.salary?.max ?? null,
      currency: null,
    })
    : labels.notSpecified;
  const salaryType = data.addSalary
    ? resolvePreviewString(
      previewLabels.salaryType,
      resolveNamedValue(
        data.salary?.type,
        job?.salary_type_id,
        job?.salary_type?.title,
      ),
    )
    : "-";
  const currencyCode = data.addSalary
    ? resolvePreviewString(
      previewLabels.currency,
      resolveNamedValue(
        data.salary?.currency,
        job?.currency_id,
        job?.currency?.code,
      ),
    )
    : "";


  return {
    title:
      data.title === "__other__"
        ? resolvedTitle
        : resolvePreviewString(previewLabels.title, resolvedTitle),
    employmentType: resolvePreviewString(
      previewLabels.employmentType,
      resolveNamedValue(
        data.employmentType,
        job?.employment_type_id,
        job?.employment_type?.title,
      ),
    ),
    description: data.description || labels.noDescriptionHtml,
    skills:
      previewLabels.skills ??
      data.skills?.map(
        (skillId) =>
          job?.skills?.find((skill) => String(skill.id) === skillId)?.title ?? skillId,
      ) ??
      [],
    salary,
    currencyCode,
    salaryType,
    city: resolvePreviewString(
      previewLabels.city,
      resolveNamedValue(data.city, job?.city_id, job?.city?.name),
    ),
    country: resolvePreviewString(
      previewLabels.country,
      resolveNamedValue(data.country, job?.country_id, job?.country?.name),
    ),
    experience: resolvePreviewString(
      previewLabels.yearsOfExperience,
      resolveCustomOrNamedValue(
        data.yearsOfExperience,
        data.otherExperienceTitle,
        job?.experience_id,
        job?.experience_title ?? job?.experience?.title,
      ),
    ),
    category: resolvePreviewString(
      previewLabels.category,
      resolveCustomOrNamedValue(
        data.category,
        data.otherCategoryTitle,
        job?.category_id,
        job?.category_title ?? job?.category?.title,
      ),
    ),
    specialty: resolvePreviewString(
      previewLabels.specialty,
      resolveNamedValue(
        data.specialty,
        job?.specialty_id,
        job?.specialty?.title,
      ),
    ),
    roleCategory: resolvePreviewString(
      previewLabels.roleCategory,
      resolveNamedValue(
        data.roleCategory,
        job?.role_category_id,
        job?.role_category?.title,
      ),
    ),
    seniorityLevel: resolvePreviewString(
      previewLabels.seniorityLevel,
      resolveNamedValue(
        data.seniorityLevel,
        job?.seniority_level_id,
        job?.seniority_level?.title,
      ),
    ),
    educationLevels:
      previewLabels.educationLevel ??
      data.educationLevel?.map(
        (levelId) =>
          job?.education_levels?.find((level) => String(level.id) === levelId)?.title ??
          levelId,
      ) ??
      [],
    mandatoryCertifications:
      previewLabels.mandatoryCertifications ??
      data.mandatoryCertifications?.map((certificationId) => {
        if (certificationId.startsWith("__custom__:")) {
          return certificationId.replace("__custom__:", "");
        }

        return (
          job?.mandatory_certifications?.find(
            (item) => String(item.mandatory_certification_id) === certificationId,
          )?.mandatory_certification?.title ??
          job?.mandatory_certifications?.find(
            (item) => String(item.id) === certificationId,
          )?.title ??
          certificationId
        );
      }) ??
      [],
    availability: resolvePreviewString(
      previewLabels.availability,
      resolveCustomOrNamedValue(
        data.availability,
        data.otherAvailabilityTitle,
        job?.availability_id,
        job?.availability_title ?? job?.availability?.title,
      ),
    ),
  };
}

function buildSidebarData(
  data: JobFormData,
  job: JobDetails | null,
  previewLabels: JobPreviewLabels,
  labels: { notSpecified: string },
): ReviewSidebarData {
  const addSalary = Boolean(data.addSalary || job?.has_salary);
  const salary = addSalary
    ? getJobSalary({
      min_salary: data.salary?.min ?? job?.min_salary ?? null,
      max_salary: data.salary?.max ?? job?.max_salary ?? null,
      currency: null,
    })
    : labels.notSpecified;

  const salaryType = addSalary
    ? resolveDisplayValue(
      previewLabels.salaryType,
      data.salary?.type,
      job?.salary_type_id,
      job?.salary_type?.title,
    )
    : "-";

  const currencyCode = addSalary
    ? resolveDisplayValue(
      previewLabels.currency,
      data.salary?.currency,
      job?.currency_id,
      job?.currency?.code,
    )
    : "";

  return {
    salary,
    currencyCode,
    salaryType,
    city: resolveDisplayValue(
      previewLabels.city,
      data.city,
      job?.city_id,
      job?.city?.name,
    ),
    country: resolveDisplayValue(
      previewLabels.country,
      data.country,
      job?.country_id,
      job?.country?.name,
    ),
    experience: resolveDisplayValue(
      previewLabels.yearsOfExperience,
      data.yearsOfExperience === "__other__"
        ? data.otherExperienceTitle
        : data.yearsOfExperience,
      job?.experience_id,
      job?.experience_title ?? job?.experience?.title,
    ),
    category: resolveDisplayValue(
      previewLabels.category,
      data.category === "__other__" ? data.otherCategoryTitle : data.category,
      job?.category_id,
      job?.category_title ?? job?.category?.title,
    ),
    specialty: resolveDisplayValue(
      previewLabels.specialty,
      data.specialty,
      job?.specialty_id,
      job?.specialty_title ?? job?.specialty?.title,
    ),
    roleCategory: resolveDisplayValue(
      previewLabels.roleCategory,
      data.roleCategory,
      job?.role_category_id,
      job?.role_category?.title,
    ),
    seniorityLevel: resolveDisplayValue(
      previewLabels.seniorityLevel,
      data.seniorityLevel,
      job?.seniority_level_id,
      job?.seniority_level?.title,
    ),
    educationLevels:
      previewLabels.educationLevel ??
      data.educationLevel?.map(
        (levelId) =>
          job?.education_levels?.find((level) => String(level.id) === levelId)?.title ??
          levelId,
      ) ??
      [],
    mandatoryCertifications:
      previewLabels.mandatoryCertifications ??
      data.mandatoryCertifications?.map((certificationId) => {
        if (certificationId.startsWith("__custom__:")) {
          return certificationId.replace("__custom__:", "");
        }

        return (
          job?.mandatory_certifications?.find(
            (item) => String(item.mandatory_certification_id) === certificationId,
          )?.mandatory_certification?.title ??
          job?.mandatory_certifications?.find(
            (item) => String(item.id) === certificationId,
          )?.title ??
          certificationId
        );
      }) ??
      [],
    availability: resolveDisplayValue(
      previewLabels.availability,
      data.availability === "__other__"
        ? data.otherAvailabilityTitle
        : data.availability,
      job?.availability_id,
      job?.availability_title ?? job?.availability?.title,
    ),
  };
}

function ReviewSidebarCards({ preview }: { preview: ReviewSidebarData }) {
  const t = useTranslations();
  const tPostJob = useTranslations("companyPage.postJob");

  return (
    <>
      <div className="card border-border shadow-card flex min-h-36 items-start justify-around rounded-2xl border-2 bg-white px-6 py-8 lg:justify-between">
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center p-1 rounded-full border-3 border-primary">
            <Image
              src={"/assets/icons/dollar.svg"}
              width={20}
              height={20}
              alt=""
            />
          </div>
          <h4 className="text-foreground text-lg font-semibold">
            {tPostJob("review.salary")}
            {preview.salaryType !== "-" ? ` (${preview.currencyCode})` : ""}
          </h4>
          <p className="text-primary text-md font-semibold">
            {preview.salary}
            {/* {preview.salaryType !== "-" ? preview.currencyCode : ""} */}
          </p>
          <span className="text-muted-foreground text-sm">{preview.salaryType}</span>
        </div>
        <div className="bg-muted h-full w-0.5"></div>
        <div className="flex flex-1 flex-col items-center justify-center gap-1 -mt-[3px]">
          <div className="flex items-center justify-center ">
            <Image
              src={"/assets/icons/map-pin.svg"}
              width={38}
              height={38}
              alt=""
            />
          </div>
          <h4 className="text-foreground text-lg font-semibold">{tPostJob("review.jobLocation")}</h4>
          <p className="text-muted-foreground text-md text-center font-semibold">
            {preview.city}
            {preview.city !== "-" ? "," : ""}
            <br />
            {preview.country}
          </p>
        </div>
      </div>

      <div className="card border-border shadow-card min-h-36 rounded-2xl border-2 bg-white px-6 py-8">
        <h2 className="text-foreground mb-4 text-lg font-semibold">
          {tPostJob("review.jobOverview")}
        </h2>
        <div className="grid grid-cols-2 gap-6 px-3 text-sm">
          <div className="col-span-2">
            <JobOverviewItem
              label={tPostJob("review.fields.experience")}
              value={preview.experience}
              icon="/assets/icons/exp.svg"
              emptyValueLabel={t("jobsPage.not-specified")}
            />
          </div>
          <JobOverviewItem
            label={tPostJob("review.fields.jobCategory")}
            value={preview.category}
            icon="/assets/icons/job-category.svg"
            emptyValueLabel={t("jobsPage.not-specified")}
          />
          <JobOverviewItem
            label={tPostJob("review.fields.specialty")}
            value={preview.specialty}
            icon="/assets/icons/specialty.svg"
            emptyValueLabel={t("jobsPage.not-specified")}
          />
          <JobOverviewItem
            label={tPostJob("review.fields.roleCategory")}
            value={preview.roleCategory}
            icon="/assets/icons/role-category.svg"
            emptyValueLabel={t("jobsPage.not-specified")}
          />
          <JobOverviewItem
            label={tPostJob("review.fields.seniorityLevel")}
            value={preview.seniorityLevel}
            icon="/assets/icons/seniority.svg"
            emptyValueLabel={t("jobsPage.not-specified")}
          />
        </div>
      </div>

      <div className="card border-border shadow-card min-h-36 rounded-2xl border-2 bg-white px-6 py-8">
        <h2 className="text-foreground mb-4 text-lg font-semibold">
          {tPostJob("review.educationSectionTitle")}
        </h2>
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/exp.svg"
                width={20} height={20}
                alt=""
              />
              <p className="text-muted-foreground text-md">{tPostJob("review.fields.educationLevel")}</p>
            </div>
            <ul className="mt-2 flex flex-col gap-2">
              {preview.educationLevels.map((level) => (
                <li className="text-foreground font-semibold" key={level}>
                  {level}
                </li>
              ))}
              {preview.educationLevels.length === 0 && (
                <li className="text-foreground font-semibold">-</li>
              )}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/case.svg"
                width={20} height={20}
                alt=""
              />
              <p className="text-muted-foreground text-md">{tPostJob("review.fields.mandatoryCertifications")}</p>
            </div>
            <ul className="mt-2 flex flex-col gap-2">
              {preview.mandatoryCertifications.map((item) => (
                <li className="edu-certificate" key={item}>
                  {item}
                </li>
              ))}
              {preview.mandatoryCertifications.length === 0 && (
                <li className="edu-certificate">-</li>
              )}
            </ul>
          </div>
          <JobOverviewItem
            label={tPostJob("review.fields.availability")}
            value={preview.availability}
            icon="/assets/icons/case.svg"
            emptyValueLabel={t("jobsPage.not-specified")}
          />
        </div>
      </div>
    </>
  );
}

export default function JobReviewPanel({
  data,
  job,
  isEditMode = false,
  previewLabels = {},
}: {
  data: JobFormData;
  job: JobDetails | null;
  isEditMode?: boolean;
  previewLabels?: JobPreviewLabels;
}) {
  const t = useTranslations();
  const tPostJob = useTranslations("companyPage.postJob");

  const labels = {
    untitledJob: tPostJob("review.untitledJob"),
    notSpecified: t("jobsPage.not-specified"),
    noDescriptionHtml: tPostJob("review.noDescriptionHtml"),
  };

  if (!job && !isEditMode) {
    return (
      <section className="p-6">
        <p className="text-muted-foreground text-sm">
          {tPostJob("review.noPreviewData")}
        </p>
      </section>
    );
  }

  const preview = isEditMode ? buildEditPreviewData(data, job, previewLabels, labels) : null;
  const sidebarPreview = buildSidebarData(data, job, previewLabels, labels);
  const skills = preview?.skills ?? job?.skills?.map((skill) => skill.title) ?? [];

  return (
    <section>
      <div className="mt-5 flex items-center gap-6 p-4">
        <Image
          src="/assets/new-logo-dot.svg"
          alt={tPostJob("review.companyLogoAlt")}
          width={96}
          height={86}
          className="h-16 md:h-20 w-16 md:w-20"
        />

        <div>
          <h6 className="text-foreground text-base md:text-2xl font-semibold mb-2">
            {preview?.title ?? job?.title ?? job?.job_title?.title ?? data.title}
          </h6>
          <div className="flex items-start sm:items-center gap-2 max-sm:flex-col">
            <span className="text-muted-foreground text-sm md:text-lg font-normal">
              {tPostJob("review.at")} {job?.company?.name ?? tPostJob("review.companyFallback")}
            </span>{" "}
            <Badge size="md" className="rounded-[3px] bg-[#0BA02C] max-sm:text-[10px]">
              {preview?.employmentType?.toUpperCase() ??
                job?.employment_type?.title?.toUpperCase() ??
                tPostJob("review.na")}
            </Badge>{" "}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 max-lg:gap-y-5 lg:gap-5 lg:p-7 lg:grid-cols-3">
        <div className="font-noto-sans col-span-2 text-[#212529] max-sm:order-2">
          <h3 className="text-primary mb-4 text-xl font-bold">
            {tPostJob("review.jobDescriptionTitle")}
          </h3>
          <div
            className="prose prose-sm max-w-none border-b pb-5"
            dangerouslySetInnerHTML={{
              __html:
                preview?.description ||
                job?.description ||
                labels.noDescriptionHtml,
            }}
          />
          <div>
            <h3 className="text-primary font-outfit mt-5 text-xl font-bold">
              {tPostJob("review.skillsTitle")}
            </h3>
            <ul className="dashed-list mt-5 flex flex-col gap-1.5 ps-7 text-sm">
              {skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
              {skills.length === 0 && <li>{tPostJob("review.noSkillsSelected")}</li>}
            </ul>
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-8 max-sm:order-1">
          <ReviewSidebarCards preview={sidebarPreview} />
        </div>
      </div>
    </section>
  );
}
