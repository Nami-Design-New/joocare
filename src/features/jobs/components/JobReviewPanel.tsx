import React from "react";
import { JobFormData } from "../validation/job-post-schema";
import Image from "next/image";
import { Badge } from "@/shared/components/ui/badge";
import JobOverviewCard from "./company/JobOverviewCard";
import JobLocationAndSalaryCard from "./company/JobLocationAndSalaryCard";
import JobEducationAndCertificationsCard from "./company/JobEducationAndCertificationsCard";
import { JobDetails } from "../types/jobs.types";
import { getJobSalary } from "../utils";

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

function resolveTitle(data: JobFormData, job: JobDetails | null) {
  if (data.title === "__other__") {
    return data.otherJobTitle?.trim() || job?.title || "Untitled job";
  }

  if (data.title) {
    return data.title === toIdString(job?.job_title_id)
      ? (job?.job_title?.title ?? "Untitled job")
      : data.title;
  }

  return job?.title ?? job?.job_title?.title ?? "Untitled job";
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
): ReviewPreviewData {
  const resolvedTitle = resolveTitle(data, job);
  const salary = data.addSalary
    ? getJobSalary({
        min_salary: data.salary?.min ?? null,
        max_salary: data.salary?.max ?? null,
        currency: null,
      })
    : "Not specified";
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
    description: data.description || "<p>No description available.</p>",
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
      resolveNamedValue(
        data.yearsOfExperience,
        job?.experience_id,
        job?.experience?.title,
      ),
    ),
    category: resolvePreviewString(
      previewLabels.category,
      resolveNamedValue(data.category, job?.category_id, job?.category?.title),
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
      resolveNamedValue(
        data.availability,
        job?.availability_id,
        job?.availability?.title,
      ),
    ),
  };
}

function EditModeReviewCards({ preview }: { preview: ReviewPreviewData }) {
  return (
    <>
      <div className="card border-border shadow-card flex min-h-36 items-center justify-around rounded-2xl border-2 bg-white px-6 py-8 lg:justify-between">
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <Image
            src={"/assets/icons/dollar.svg"}
            width={38}
            height={38}
            alt="currancy icon"
          />
          <h4 className="text-foreground text-lg font-semibold">
            Salary {preview.salaryType !== "-" ? `(${preview.currencyCode})` : ""}
          </h4>
          <p className="text-primary text-md font-semibold">
            {preview.salary} {preview.salaryType !== "-" ? preview.currencyCode : ""}
          </p>
          <span className="text-muted-foreground text-sm">{preview.salaryType}</span>
        </div>
        <div className="bg-muted h-full w-0.5"></div>
        <div className="flex flex-1 flex-col items-center justify-center gap-1">
          <Image
            src={"/assets/icons/map-pin.svg"}
            width={38}
            height={38}
            alt="Location icon"
          />
          <h4 className="text-foreground text-lg font-semibold">Job Location</h4>
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
          Job Overview
        </h2>
        <div className="grid grid-cols-2 gap-4 px-4 text-sm">
          <p className="col-span-2">
            <strong>Experience:</strong> {preview.experience}
          </p>
          <p>
            <strong>Job Category:</strong> {preview.category}
          </p>
          <p>
            <strong>Specialty:</strong> {preview.specialty}
          </p>
          <p>
            <strong>Role category:</strong> {preview.roleCategory}
          </p>
          <p>
            <strong>Seniority Level:</strong> {preview.seniorityLevel}
          </p>
        </div>
      </div>

      <div className="card border-border shadow-card min-h-36 rounded-2xl border-2 bg-white px-6 py-8">
        <h2 className="text-foreground mb-4 text-lg font-semibold">
          Education & Certifications section
        </h2>
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-muted-foreground text-md mb-2">Education Level</p>
            <ul className="mt-2 flex flex-col gap-2">
              {preview.educationLevels.map((level) => (
                <li className="edu-certificate" key={level}>
                  {level}
                </li>
              ))}
              {preview.educationLevels.length === 0 && (
                <li className="edu-certificate">-</li>
              )}
            </ul>
          </div>
          <div>
            <p className="text-muted-foreground text-md mb-2">
              Mandatory Certifications
            </p>
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
          <p className="text-sm">
            <strong>Availability:</strong> {preview.availability}
          </p>
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
  if (!job && !isEditMode) {
    return (
      <section className="p-6">
        <p className="text-muted-foreground text-sm">
          No preview data yet. Complete step 2 successfully to load job details.
        </p>
      </section>
    );
  }

  const preview = isEditMode ? buildEditPreviewData(data, job, previewLabels) : null;
  const skills = preview?.skills ?? job?.skills?.map((skill) => skill.title) ?? [];

  return (
    <section>
      <div className="mt-5 flex items-center gap-6 p-4">
        <Image
          src="/assets/comp-logo.svg"
          alt="Company logo"
          width={96}
          height={86}
        />

        <div>
          <h6 className="text-foreground text-2xl font-semibold">
            {preview?.title ?? job?.title ?? job?.job_title?.title ?? data.title}
          </h6>
          <p>
            <span className="text-muted-foreground text-lg font-normal">
              at {job?.company?.name ?? "Company"}
            </span>{" "}
            <Badge size="md" className="rounded-sm bg-[#0BA02C]">
              {preview?.employmentType?.toUpperCase() ??
                job?.employment_type?.title?.toUpperCase() ??
                "N/A"}
            </Badge>{" "}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 p-7 lg:grid-cols-3">
        <div className="font-noto-sans col-span-2 text-[#212529]">
          <h3 className="text-primary mb-4 text-xl font-bold">
            Job description
          </h3>
          <div
            className="prose prose-sm max-w-none border-b pb-5"
            dangerouslySetInnerHTML={{
              __html:
                preview?.description ||
                job?.description ||
                "<p>No description available.</p>",
            }}
          />
          <div>
            <h3 className="text-primary font-outfit mt-5 text-xl font-bold">
              Skills:
            </h3>
            <ul className="dashed-list mt-5 flex flex-col gap-1.5 ps-7 text-sm">
              {skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
              {skills.length === 0 && <li>No skills selected.</li>}
            </ul>
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-8">
          {isEditMode && preview ? (
            <EditModeReviewCards preview={preview} />
          ) : (
            <>
              <JobLocationAndSalaryCard job={job!} />
              <JobOverviewCard job={job!} />
              <JobEducationAndCertificationsCard job={job!} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
