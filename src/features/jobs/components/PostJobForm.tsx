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

// ─── Form mode ──────────────────────────────────────────
// create  → fresh form, step-by-step, saves each step
// complete→ prefilled draft, step-by-step, saves each step
// edit    → prefilled published job, single-step, saves all at once
// ─────────────────────────────────────────────────────────
type FormMode = "create" | "complete" | "edit";
type StepOneOptionKey = "title" | "country" | "city";
type StepOneDisplayOptions = Partial<Record<StepOneOptionKey, Option>>;

const STEPS = ["Job Details", "Job Description & Requirements", "Job Preview"];
const LAST_STEP = STEPS.length - 1;
const CUSTOM_CERTIFICATION_PREFIX = "__custom__:";

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
  console.log("job destias", job);

  return {
    title: job.title ? "__other__" : String(job.job_title_id ?? ""),
    otherJobTitle: job.title ?? "",
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
    category: String(job.category_id ?? ""),
    specialty: String(job.specialty_id ?? ""),
    employmentType: String(job.employment_type_id ?? ""),
    roleCategory: String(job.role_category_id ?? ""),
    seniorityLevel: String(job.seniority_level_id ?? ""),
    country: String(job.country_id ?? ""),
    city: String(job.city_id ?? ""),
    yearsOfExperience: String(job.experience_id ?? ""),
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
    availability: String(job.availability_id ?? ""),
    description: job.description ?? "",
    skills: (job.skills ?? []).map((s) => String(s.id)),
  };
}

export default function PostJobForm() {
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

  const { data: session } = useSession();
  const token = session?.accessToken || "";
  const router = useRouter();
  const queryClient = useQueryClient();

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

  const { handleSubmit, trigger, getValues, reset, setError } = methods;

  // ─── Hydrate form when existing job arrives ───────────
  useEffect(() => {
    if (existingJob && !formHydrated) {
      const mappedData = mapJobToFormData(existingJob);
      reset({ ...jobFormDefaults, ...mappedData } as JobFormData);
      setReviewJob(existingJob);
      setStepOneDisplayOptions({
        title: existingJob.title
          ? { label: existingJob.title, value: "__other__" }
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
      job_title_id: data.title === "__other__" ? undefined : Number(data.title),
      title: data.title === "__other__" ? data.otherJobTitle?.trim() ?? "" : undefined,
      professional_license: data.license,
      has_salary: hasSalary,
      category_id: Number(data.category),
      specialty_id: Number(data.specialty),
      employment_type_id: Number(data.employmentType),
      role_category_id: Number(data.roleCategory),
      seniority_level_id: Number(data.seniorityLevel || 0),
      country_id: Number(data.country),
      city_id: Number(data.city),
      experience_id: Number(data.yearsOfExperience),
      mandatory_certifications: (data.mandatoryCertifications ?? []).map(
        normalizeMandatoryCertificationValue,
      ),
      education_levels: (data.educationLevel ?? []).map((item) => Number(item)),
      availability_id: Number(data.availability),
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
      job_title_id: data.title === "__other__" ? undefined : Number(data.title),
      title: data.title === "__other__" ? data.otherJobTitle?.trim() ?? "" : undefined,
      professional_license: data.license,
      has_salary: data.addSalary ? 1 : 0,
      category_id: Number(data.category),
      specialty_id: Number(data.specialty),
      employment_type_id: Number(data.employmentType),
      role_category_id: Number(data.roleCategory),
      seniority_level_id: Number(data.seniorityLevel || 0),
      country_id: Number(data.country),
      city_id: Number(data.city),
      experience_id: Number(data.yearsOfExperience),
      mandatory_certifications: (data.mandatoryCertifications ?? []).map(
        normalizeMandatoryCertificationValue,
      ),
      education_levels: (data.educationLevel ?? []).map((item) => Number(item)),
      availability_id: Number(data.availability),
      description: data.description,
      skills: (data.skills ?? []).map((s) => Number(s)),
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
            <p className="text-muted-foreground">Loading job data...</p>
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
      <div className="h-full rounded-2xl bg-white p-6">
        <div className="flex gap-6">
          <WizardProgress step={currentStep} steps={STEPS} />
          {/* Save as Draft — hidden in edit mode */}
          {!isEditMode && currentStep !== 0 && (
            <Button
              variant="outline"
              size="pill"
              hoverStyle="slidePrimary"
              onClick={() => setSaveDraftOpen(true)}
            >
              Save as Draft
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
                />
              )}
              {currentStep === 1 && <JobPostStepTwo />}
              {currentStep === 2 && <JobReviewPanel data={getValues()} job={reviewJob} />}
            </div>

            <div className="mt-5 flex w-full items-center justify-center gap-6">
              {currentStep > 0 && (
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  hoverStyle="slidePrimary"
                  size="pill"
                  className="w-1/6"
                >
                  Prev
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
                  className="w-1/6"
                >
                  {isBusy && !isEditMode ? "Saving..." : "Next"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => handleSubmit(onSubmit)()}
                  disabled={isSubmitting || isBusy || isStepOneEditLoading}
                  variant="secondary"
                  size="pill"
                  hoverStyle="slidePrimary"
                  className="w-1/6"
                >
                  {isSubmitting ? (
                    <>
                      {isEditMode ? "Saving..." : "Posting..."}
                    </>
                  ) : isEditMode ? (
                    "Save Changes"
                  ) : (
                    "Confirm & Post Job"
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
        title="Save as draft"
        description="All the data you have entered will be saved in the 'Drafts' list. The advertisement will not be published to the public until you complete it and click the publish button."
        confirmLabel="Save as draft"
        cancelLabel="Back"
        onConfirm={handleSaveDraft}
        isLoading={isPostingStepThree}
      />
      <SuccessModal
        open={saveSuccessOpen}
        onOpenChange={setSaveSuccessOpen}
        title="Saved successfully"
        description="You can return to complete the job details and publish them at any time from the 'Job Management' list."
      />
      <SuccessModal
        open={postSuccess}
        onOpenChange={setPostSuccess}
        title={isEditMode
          ? "Job updated successfully!"
          : "Your advertisement has been successfully published!"}
        description={isEditMode
          ? "Your changes have been saved and the job listing has been updated."
          : "Your advertisement is now available to thousands of medical professionals on the platform. We will notify you as soon as any suitable candidates apply. You can track statistics and applicant interactions through the dashboard."}
      />
    </section>
  );
}
