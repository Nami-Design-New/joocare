"use client";

import WizardProgress from "@/features/complete-account/components/wizard-progress";
import AlertModal from "@/shared/components/modals/AlertModal";
import SuccessModal from "@/shared/components/modals/SuccessModal";
import { Button } from "@/shared/components/ui/button";
import { typedZodResolver } from "@/shared/lib/typed-zod-resolver";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import type { Path } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  JobFormData,
  jobFormDefaults,
  jobFormSchema,
  StepIndex,
  stepSchemas,
} from "../validation/job-post-schema";
import { usePostStepOne } from "../hooks/usePostStepOne";
import { usePostStepTwo } from "../hooks/usePostStepTwo";
import { usePostStepThree } from "../hooks/usePostStepThree";
import { useGetCompanyJob } from "../hooks/useGetCompanyJob";
import { useUpdateStepOne } from "../hooks/useUpdateStepOne";
import { useUpdateJob } from "../hooks/useUpdateJob";
import { JobStepOnePayload } from "../types/job-steps.types";
import { JobDetails } from "../types/jobs.types";
import JobPostStepOne from "./JobPostStepOne";
import JobPostStepTwo from "./JobPostStepTwo";
import JobReviewPanel from "./JobReviewPanel";
import { useRouter } from "@/i18n/navigation";
import { useQueryClient } from "@tanstack/react-query";
import type { Option } from "@/shared/components/SelectInputField";
import { useTranslations } from "next-intl";

// ─── Form mode ──────────────────────────────────────────
// create  → fresh form, step-by-step, saves each step
// complete→ prefilled draft, step-by-step, saves each step
// edit    → prefilled published job, single-step, saves all at once
// ─────────────────────────────────────────────────────────
type FormMode = "create" | "complete" | "edit";
type StepOneOptionKey = "title" | "country" | "city";
type StepOneDisplayOptions = Partial<Record<StepOneOptionKey, Option>>;
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

const LAST_STEP = 2;
const CUSTOM_CERTIFICATION_PREFIX = "__custom__:";
const OTHER_OPTION_VALUE = "__other__";

function normalizeMandatoryCertificationValue(value: string) {
  return value.startsWith(CUSTOM_CERTIFICATION_PREFIX)
    ? value.slice(CUSTOM_CERTIFICATION_PREFIX.length)
    : Number(value);
}

function getJobFromMutationResponse(response: unknown): JobDetails | null {
  if (!response || typeof response !== "object") return null;

  const responseRecord = response as { data?: unknown; job?: unknown };

  if (responseRecord.data && typeof responseRecord.data === "object") {
    const nestedData = responseRecord.data as { job?: unknown; data?: unknown };

    if (nestedData.job && typeof nestedData.job === "object") {
      return nestedData.job as JobDetails;
    }

    if (nestedData.data && typeof nestedData.data === "object") {
      const deeperData = nestedData.data as { job?: unknown };
      if (deeperData.job && typeof deeperData.job === "object") {
        return deeperData.job as JobDetails;
      }
    }
  }

  if (responseRecord.job && typeof responseRecord.job === "object") {
    return responseRecord.job as JobDetails;
  }

  return null;
}

function toOptionalNumber(value: string | number | null | undefined) {
  if (value === "" || value == null) {
    return undefined;
  }

  const normalizedValue =
    typeof value === "string" ? value.replace(/,/g, "").trim() : value;
  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}


function getJobStatus(job: JobDetails) {
  console.log("job status:", job.current_status?.status, job.status, job);
  return job.status?.toLowerCase() ?? "";
}


// ─── Map API job → form defaults ────────────────────────
function mapJobToFormData(job: JobDetails): Partial<JobFormData> {
  const hasSalary = Boolean(job.has_salary);
  const customCategoryTitle = job.category_title?.trim() || job.category?.title || "";
  const customExperienceTitle =
    job.experience_title?.trim() || job.experience?.title || "";
  const customAvailabilityTitle =
    job.availability_title?.trim() || job.availability?.title || "";
  console.log("job destias", job);

  return {
    title: job.title ? OTHER_OPTION_VALUE : String(job.job_title_id ?? ""),
    otherJobTitle: job.title ?? "",
    category:
      job.category_id == null && customCategoryTitle
        ? OTHER_OPTION_VALUE
        : String(job.category_id ?? ""),
    otherCategoryTitle: job.category_id == null ? customCategoryTitle : "",
    license: job.professional_license ?? "",
    addSalary: hasSalary,
    salary: hasSalary
      ? {
        min: toOptionalNumber(job.min_salary),
        max: toOptionalNumber(job.max_salary),
        type: String(job.salary_type_id ?? ""),
        currency: String(job.currency_id ?? ""),
      }
      : { min: undefined, max: undefined, type: "", currency: "" },
    specialty: String(job.specialty_title ?? ""),
    employmentType: String(job.employment_type_id ?? ""),
    roleCategory: String(job.role_category_id ?? ""),
    seniorityLevel: String(job.seniority_level_id ?? ""),
    country: String(job.country_id ?? ""),
    city: String(job.city_id ?? ""),
    yearsOfExperience:
      job.experience_id == null && customExperienceTitle
        ? OTHER_OPTION_VALUE
        : String(job.experience_id ?? ""),
    otherExperienceTitle: job.experience_id == null ? customExperienceTitle : "",
    educationLevel: (job.education_levels ?? []).map((item) => String(item.id)),
    mandatoryCertifications: (job.mandatory_certifications ?? [])
      .map((item) => {
        if (item.mandatory_certification_id != null) {
          return String(item.mandatory_certification_id);
        }

        if (item.title?.trim()) {
          return `${CUSTOM_CERTIFICATION_PREFIX}${item.title.trim()}`;
        }

        return null;
      })
      .filter((item): item is string => Boolean(item)),
    availability:
      job.availability_id == null && customAvailabilityTitle
        ? OTHER_OPTION_VALUE
        : String(job.availability_id ?? ""),
    otherAvailabilityTitle:
      job.availability_id == null ? customAvailabilityTitle : "",
    description: job.description ?? "",
    skills: (job.skills ?? []).map((s) => String(s.id)),
  };
}

export default function PostJobForm() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const jobIdParam = searchParams.get("jobId"); // complete mode
  const editIdParam = searchParams.get("editId"); // edit mode

  const mode: FormMode = useMemo(() => {
    if (editIdParam) return "edit";
    if (jobIdParam) return "complete";
    return "create";
  }, [editIdParam, jobIdParam]);

  const existingJobId = editIdParam ?? jobIdParam ?? null;
  const isEditMode = mode === "edit";

  // ─── Fetch existing job data (complete / edit) ────────
  const {
    data: existingJob,
    isLoading: isLoadingJob,
  } = useGetCompanyJob(existingJobId);

  // ─── State ─────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdJobId, setCreatedJobId] = useState<number | null>(null);
  const [reviewJob, setReviewJob] = useState<JobDetails | null>(null);
  const [formHydrated, setFormHydrated] = useState(false);
  const [hasReturnedToStepOneFromStepTwo, setHasReturnedToStepOneFromStepTwo] =
    useState(false);
  const [stepOneDisplayOptions, setStepOneDisplayOptions] =
    useState<StepOneDisplayOptions>({});
  const [previewLabels, setPreviewLabels] = useState<JobPreviewLabels>({});

  const { data: session } = useSession();
  const token = session?.accessToken || "";
  const router = useRouter();
  const queryClient = useQueryClient();

  const steps = useMemo(
    () => [
      t("companyPage.postJob.steps.jobDetails"),
      t("companyPage.postJob.steps.jobDescriptionRequirements"),
      t("companyPage.postJob.steps.jobPreview"),
    ],
    [t],
  );

  // ─── Mutations ─────────────────────────────────────────
  const { mutateAsync: postStepOne, isPending: isPostingStepOne } = usePostStepOne({ token });
  const { mutateAsync: postStepTwo, isPending: isPostingStepTwo } = usePostStepTwo({ token });
  const { mutateAsync: postStepThree, isPending: isPostingStepThree } = usePostStepThree({ token });
  const { mutateAsync: updateStepOne, isPending: isUpdatingStepOne } = useUpdateStepOne({ token });
  const { mutateAsync: updateJob, isPending: isUpdatingJob } = useUpdateJob({ token });

  // ─── Modals ────────────────────────────────────────────
  const [saveDraftOpen, setSaveDraftOpen] = useState(false);
  const [saveSuccessOpen, setSaveSuccessOpen] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // ─── Form ──────────────────────────────────────────────
  const methods = useForm<JobFormData>({
    resolver: typedZodResolver(jobFormSchema),
    defaultValues: jobFormDefaults,
    mode: "onChange",
  });

  const { handleSubmit, trigger, getValues, reset, setError, watch } = methods;
  const previewFormData = watch();

  // ─── Hydrate form when existing job arrives ───────────
  useEffect(() => {
    if (existingJob && !formHydrated) {
      const mappedData = mapJobToFormData(existingJob);
      reset({ ...jobFormDefaults, ...mappedData } as JobFormData);
      setReviewJob(existingJob);
      setStepOneDisplayOptions({
        title: existingJob.title
          ? { label: existingJob.title, value: OTHER_OPTION_VALUE }
          : existingJob.job_title
            ? {
              label: existingJob.job_title.title,
              value: String(existingJob.job_title_id ?? ""),
            }
            : undefined,
        country: existingJob.country
          ? {
            label: existingJob.country.name,
            value: String(existingJob.country_id ?? ""),
          }
          : undefined,
        city: existingJob.city
          ? {
            label: existingJob.city.name,
            value: String(existingJob.city_id ?? ""),
          }
          : undefined,
      });
      setPreviewLabels({
        title: existingJob.title ?? existingJob.job_title?.title ?? "",
        employmentType: existingJob.employment_type?.title ?? "",
        salaryType: existingJob.salary_type?.title ?? "",
        currency: existingJob.currency?.code ?? "",
        category: existingJob.category_title ?? existingJob.category?.title ?? "",
        specialty:
          existingJob.specialty_title ?? existingJob.specialty?.title ?? "",
        roleCategory: existingJob.role_category?.title ?? "",
        seniorityLevel: existingJob.seniority_level?.title ?? "",
        country: existingJob.country?.name ?? "",
        city: existingJob.city?.name ?? "",
        yearsOfExperience:
          existingJob.experience_title ?? existingJob.experience?.title ?? "",
        educationLevel: existingJob.education_levels?.map((item) => item.title) ?? [],
        mandatoryCertifications:
          existingJob.mandatory_certifications?.map(
            (item) => item.title ?? item.mandatory_certification?.title ?? "-",
          ) ?? [],
        availability:
          existingJob.availability_title ?? existingJob.availability?.title ?? "",
        skills: existingJob.skills?.map((item) => item.title) ?? [],
      });

      // In complete mode, set the createdJobId so step-by-step flow works
      if (mode === "complete") {
        setCreatedJobId(existingJob.id);
        const existingJobStatus = getJobStatus(existingJob);
        setCurrentStep(
          existingJobStatus === "draft" || existingJobStatus === "open" ? 1 : 0,
        );
      }

      setFormHydrated(true);
    }
  }, [existingJob, formHydrated, mode, reset]);

  const handleStepOneOptionChange = (key: StepOneOptionKey, option?: Option) => {
    setStepOneDisplayOptions((current) => ({
      ...current,
      [key]: option,
    }));
  };

  const handlePreviewLabelChange = (
    key: keyof JobPreviewLabels,
    value: string | string[],
  ) => {
    setPreviewLabels((current) => ({
      ...current,
      [key]: value,
    }));
  };

  // ─── Helpers ───────────────────────────────────────────
  const resolveJobId = () => createdJobId ?? reviewJob?.id ?? null;

  const submitStepThreeStatus = async (status: "draft" | "open") => {
    const jobId = resolveJobId();
    if (!jobId) {
      throw new Error("Job id is missing. Please complete previous steps first.");
    }

    const stepThreeResponse = await postStepThree({
      jobId,
      payload: { status },
    });

    const nextReviewJob = getJobFromMutationResponse(stepThreeResponse.data);

    if (nextReviewJob) {
      setReviewJob(nextReviewJob);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await submitStepThreeStatus("draft");
      setSaveDraftOpen(false);
      setSaveSuccessOpen(true);
      queryClient.refetchQueries({ queryKey: ['company-jobs'] });
      setTimeout(() => {
        router.push("/company/job-management");
      }, 3000);
    } catch {
      // errors are already handled in mutation onError toast
    }
  };

  // ─── Build edit payload from form values ──────────────
  const buildStepOnePayload = (data: JobFormData): JobStepOnePayload => {
    const hasSalary: JobStepOnePayload["has_salary"] = data.addSalary ? 1 : 0;

    const basePayload: JobStepOnePayload = {
      job_title_id: data.title === OTHER_OPTION_VALUE ? undefined : Number(data.title),
      title: data.title === OTHER_OPTION_VALUE ? data.otherJobTitle?.trim() ?? "" : undefined,
      professional_license: data.license,
      has_salary: hasSalary,
      category_id:
        data.category === OTHER_OPTION_VALUE ? undefined : Number(data.category),
      category_title:
        data.category === OTHER_OPTION_VALUE
          ? data.otherCategoryTitle?.trim() ?? ""
          : undefined,
      specialty_title: data.specialty,
      employment_type_id: Number(data.employmentType),
      role_category_id: Number(data.roleCategory),
      seniority_level_id: Number(data.seniorityLevel || 0),
      country_id: Number(data.country),
      city_id: Number(data.city),
      experience_id:
        data.yearsOfExperience === OTHER_OPTION_VALUE
          ? undefined
          : Number(data.yearsOfExperience),
      experience_title:
        data.yearsOfExperience === OTHER_OPTION_VALUE
          ? data.otherExperienceTitle?.trim() ?? ""
          : undefined,
      mandatory_certifications: (data.mandatoryCertifications ?? []).map(
        normalizeMandatoryCertificationValue,
      ),
      education_levels: (data.educationLevel ?? []).map((item) => Number(item)),
      availability_id:
        data.availability === OTHER_OPTION_VALUE
          ? undefined
          : Number(data.availability),
      availability_title:
        data.availability === OTHER_OPTION_VALUE
          ? data.otherAvailabilityTitle?.trim() ?? ""
          : undefined,
    };

    if (!data.addSalary) {
      return basePayload;
    }

    return {
      ...basePayload,
      min_salary: toOptionalNumber(data.salary?.min),
      max_salary: toOptionalNumber(data.salary?.max),
      currency_id: toOptionalNumber(data.salary?.currency),
      salary_type_id: toOptionalNumber(data.salary?.type),
    };
  };

  const buildUpdatePayload = (data: JobFormData) => {
    const basePayload = {
      _method: "put" as const,
      job_title_id: data.title === OTHER_OPTION_VALUE ? undefined : Number(data.title),
      title: data.title === OTHER_OPTION_VALUE ? data.otherJobTitle?.trim() ?? "" : undefined,
      professional_license: data.license,
      has_salary: data.addSalary ? 1 : 0,
      category_id:
        data.category === OTHER_OPTION_VALUE ? undefined : Number(data.category),
      category_title:
        data.category === OTHER_OPTION_VALUE
          ? data.otherCategoryTitle?.trim() ?? ""
          : undefined,
      specialty_title: data.specialty,
      employment_type_id: Number(data.employmentType),
      role_category_id: Number(data.roleCategory),
      seniority_level_id: Number(data.seniorityLevel || 0),
      country_id: Number(data.country),
      city_id: Number(data.city),
      experience_id:
        data.yearsOfExperience === OTHER_OPTION_VALUE
          ? undefined
          : Number(data.yearsOfExperience),
      experience_title:
        data.yearsOfExperience === OTHER_OPTION_VALUE
          ? data.otherExperienceTitle?.trim() ?? ""
          : undefined,
      mandatory_certifications: (data.mandatoryCertifications ?? []).map(
        normalizeMandatoryCertificationValue,
      ),
      education_levels: (data.educationLevel ?? []).map((item) => Number(item)),
      availability_id:
        data.availability === OTHER_OPTION_VALUE
          ? undefined
          : Number(data.availability),
      availability_title:
        data.availability === OTHER_OPTION_VALUE
          ? data.otherAvailabilityTitle?.trim() ?? ""
          : undefined,
      description: data.description,
      skills: (data.skills ?? []).map((s) => {
        // console.log(s)
        return Number(s)
      }),
      status: "open",
    };

    if (!data.addSalary) {
      return basePayload;
    }

    return {
      ...basePayload,
      min_salary: toOptionalNumber(data.salary?.min),
      max_salary: toOptionalNumber(data.salary?.max),
      currency_id: toOptionalNumber(data.salary?.currency),
      salary_type_id: toOptionalNumber(data.salary?.type),
    };
  };

  // ─── Step-by-step "Next" ────────────────────────────────
  // Edit mode: validate → advance (no API calls)
  // Create/Complete mode: validate → call step API → advance
  // ──────────────────────────────────────────────────────────
  const handleNext = async () => {
    const fields = Object.keys(
      stepSchemas[currentStep as StepIndex].shape,
    ) as (keyof JobFormData)[];
    const values = getValues();
    const stepFields: string[] = [...fields];

    if (currentStep === 0 && values.addSalary) {
      stepFields.push("salary.min", "salary.max", "salary.type", "salary.currency");
    }

    const valid = await trigger(stepFields as Parameters<typeof trigger>[0]);

    const schemaResult = stepSchemas[currentStep as StepIndex].safeParse(getValues());
    if (!schemaResult.success) {
      schemaResult.error.issues.forEach((issue) => {
        const fieldPath = issue.path.join(".");

        if (!fieldPath) return;

        setError(fieldPath as Path<JobFormData>, {
          type: "manual",
          message: issue.message,
        });
      });
    }

    if (!valid || !schemaResult.success) return;

    // ── EDIT mode: just advance, no API calls ───────────
    if (isEditMode) {
      if (currentStep === 1) {
        // Use existingJob for preview since we haven't submitted anything
        setReviewJob(existingJob ?? null);
      }
      setCurrentStep((s) => s + 1);
      return;
    }

    if (currentStep === 0) {
      if (mode === "complete" && createdJobId && hasReturnedToStepOneFromStepTwo) {
        const data = getValues();
        await updateStepOne({
          jobId: createdJobId,
          payload: buildStepOnePayload(data),
        });
        setHasReturnedToStepOneFromStepTwo(false);
        setCurrentStep((s) => s + 1);
        return;
      }

      // In complete mode without returning from step 2, keep using the existing step-one flow.
      if (mode === "complete" && createdJobId) {
        const data = getValues();

        await postStepOne(buildStepOnePayload(data));
        setHasReturnedToStepOneFromStepTwo(false);
        setCurrentStep((s) => s + 1);
        return;
      }

      // Create mode — call step-one to create the job
      const data = getValues();
      const stepOneResponse = await postStepOne(buildStepOnePayload(data));

      const nextCreatedJob = getJobFromMutationResponse(stepOneResponse.data);
      const nextCreatedJobId = Number(nextCreatedJob?.id);

      if (!nextCreatedJobId) {
        throw new Error("Unable to resolve created job id from step one response.");
      }

      setCreatedJobId(nextCreatedJobId);
      setHasReturnedToStepOneFromStepTwo(false);
      setCurrentStep((s) => s + 1);
      return;
    }
    if (currentStep === 1) {
      const data = getValues();
      const effectiveJobId = createdJobId;
      if (!effectiveJobId) {
        throw new Error("Job id is missing. Please complete step one first.");
      }

      const stepTwoResponse = await postStepTwo({
        jobId: effectiveJobId,
        payload: {
          description: data.description,
          skills: (data.skills ?? []).map((skillId) => Number(skillId)),
        },
      });
      const nextReviewJob = getJobFromMutationResponse(stepTwoResponse.data);
      setReviewJob(nextReviewJob);
      setCurrentStep((s) => s + 1);
      return;
    }

    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (mode === "complete" && currentStep === 1) {
      setHasReturnedToStepOneFromStepTwo(true);
    }

    setCurrentStep((s) => s - 1);
  };

  // ─── Final submit for create/complete mode ────────────
  const onSubmitCreateOrComplete: SubmitHandler<JobFormData> = async () => {
    setIsSubmitting(true);
    try {
      await submitStepThreeStatus("open");
      setPostSuccess(true);
      setTimeout(() => {
        router.push("/company/job-management");
      }, 3000);
      queryClient.invalidateQueries({ queryKey: ['company-jobs'] });
    } catch {
      // errors are already handled in mutation onError toast
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Final submit for edit mode ───────────────────────
  const onSubmitEdit: SubmitHandler<JobFormData> = async (data) => {
    if (!existingJobId) return;
    setIsSubmitting(true);
    try {
      const payload = buildUpdatePayload(data);
      await updateJob({ jobId: existingJobId, payload });
      setPostSuccess(true);
      setTimeout(() => {
        router.push("/company/job-management");
      }, 3000);
      queryClient.invalidateQueries({ queryKey: ['company-job', existingJobId] });
    } catch {
      // errors are already handled in mutation onError toast
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Loading gate test ────────────────────
  if (mode === "complete" && isLoadingJob) {
    return (
      <section className="h-min-dvh mx-auto max-w-7xl py-12">
        <div className="flex h-full items-center justify-center rounded-2xl bg-white p-6">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="h-8 w-8 animate-spin text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <p className="text-muted-foreground">{t("companyPage.postJob.loadingJobData")}</p>
          </div>
        </div>
      </section>
    );
  }

  // Pick the right submit handler based on mode
  const onSubmit = isEditMode ? onSubmitEdit : onSubmitCreateOrComplete;

  // Are we loading from any step API?
  const isBusy =
    isPostingStepOne ||
    isPostingStepTwo ||
    isPostingStepThree ||
    isUpdatingStepOne ||
    isUpdatingJob;
  const isStepOneEditLoading = isEditMode && currentStep === 0 && (isLoadingJob || !formHydrated);

  // ═══════════════════════════════════════════════════════
  //  UNIFIED WIZARD — same UI for create, complete & edit
  // ═══════════════════════════════════════════════════════
  return (
    <section className="h-min-dvh mx-auto max-w-7xl py-12">
      <div className="h-full rounded-2xl bg-white shadow-lg p-6">
        <div className="flex gap-6">
          <WizardProgress step={currentStep} steps={steps} />
          {/* Save as Draft — hidden in edit mode */}
          {!isEditMode && currentStep !== 0 && (
            <Button
              variant="outline"
              size="pill"
              hoverStyle="slidePrimary"
              onClick={() => setSaveDraftOpen(true)}
            >
              {t("companyPage.postJob.actions.saveAsDraft")}
            </Button>
          )}
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="min-h-80">
              {currentStep === 0 && (
                <JobPostStepOne
                  isLoading={isStepOneEditLoading}
                  persistedOptions={stepOneDisplayOptions}
                  onPersistOption={handleStepOneOptionChange}
                  onPreviewLabelChange={handlePreviewLabelChange}
                  existingJob={existingJob}
                />
              )}
              {currentStep === 1 && (
                <JobPostStepTwo
                  onPreviewLabelChange={handlePreviewLabelChange}
                  existingJob={existingJob}
                />
              )}
              {currentStep === 2 && (
                <JobReviewPanel
                  data={previewFormData as JobFormData}
                  job={reviewJob}
                  isEditMode={isEditMode}
                  previewLabels={previewLabels}
                />
              )}
            </div>

            <div className="mt-5 flex w-full items-center justify-center gap-6">
              {currentStep > 0 && (
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  hoverStyle="slidePrimary"
                  size="pill"
                  className="w-2/6 md:w-1/6"
                >
                  {t("companyPage.postJob.actions.prev")}
                </Button>
              )}

              {currentStep < LAST_STEP ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isBusy || isStepOneEditLoading}
                  variant="secondary"
                  hoverStyle="slidePrimary"
                  size="pill"
                  className="w-2/6 md:w-1/6"
                >
                  {isBusy && !isEditMode
                    ? t("common.saving")
                    : t("companyPage.postJob.actions.next")}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => handleSubmit(onSubmit)()}
                  disabled={isSubmitting || isBusy || isStepOneEditLoading}
                  variant="secondary"
                  size="pill"
                  hoverStyle="slidePrimary"
                  className="w-3/6 md:w-1/6"
                >
                  {isSubmitting ? (
                    <>
                      {isEditMode ? t("common.saving") : t("companyPage.postJob.actions.posting")}
                    </>
                  ) : isEditMode ? (
                    t("companyPage.postJob.actions.saveChanges")
                  ) : (
                    t("companyPage.postJob.actions.confirmPostJob")
                  )}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>

      <AlertModal
        open={saveDraftOpen}
        onOpenChange={setSaveDraftOpen}
        title={t("companyPage.postJob.modals.saveDraft.title")}
        description={t("companyPage.postJob.modals.saveDraft.description")}
        confirmLabel={t("companyPage.postJob.modals.saveDraft.confirm")}
        cancelLabel={t("common.back")}
        onConfirm={handleSaveDraft}
        isLoading={isPostingStepThree}
      />
      <SuccessModal
        open={saveSuccessOpen}
        onOpenChange={setSaveSuccessOpen}
        title={t("companyPage.postJob.modals.savedSuccessfully.title")}
        description={t("companyPage.postJob.modals.savedSuccessfully.description")}
      />
      <SuccessModal
        open={postSuccess}
        onOpenChange={setPostSuccess}
        title={
          isEditMode
            ? t("companyPage.postJob.modals.postSuccess.updatedTitle")
            : t("companyPage.postJob.modals.postSuccess.publishedTitle")
        }
        description={
          isEditMode
            ? t("companyPage.postJob.modals.postSuccess.updatedDescription")
            : t("companyPage.postJob.modals.postSuccess.publishedDescription")
        }
      />
    </section>
  );
}
