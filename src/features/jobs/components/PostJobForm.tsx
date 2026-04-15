"use client";

import WizardProgress from "@/features/complete-account/components/wizard-progress";
import AlertModal from "@/shared/components/modals/AlertModal";
import SuccessModal from "@/shared/components/modals/SuccessModal";
import { Button } from "@/shared/components/ui/button";
import { typedZodResolver } from "@/shared/lib/typed-zod-resolver";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
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
import { useUpdateJob } from "../hooks/useUpdateJob";
import { JobDetails } from "../types/jobs.types";
import JobPostStepOne from "./JobPostStepOne";
import JobPostStepTwo from "./JobPostStepTwo";
import JobReviewPanel from "./JobReviewPanel";
import { useRouter } from "@/i18n/navigation";
import { useQueryClient } from "@tanstack/react-query";

// ─── Form mode ──────────────────────────────────────────
// create  → fresh form, step-by-step, saves each step
// complete→ prefilled draft, step-by-step, saves each step
// edit    → prefilled published job, single-step, saves all at once
// ─────────────────────────────────────────────────────────
type FormMode = "create" | "complete" | "edit";

const STEPS = ["Job Details", "Job Description & Requirements", "Job Preview"];
const LAST_STEP = STEPS.length - 1;

// ─── Map API job → form defaults ────────────────────────
function mapJobToFormData(job: JobDetails): Partial<JobFormData> {
  const hasSalary = Boolean(job.has_salary);
  return {
    title: job.title ? "__other__" : String(job.job_title_id ?? ""),
    otherJobTitle: job.title ?? "",
    license: job.professional_license ?? "",
    addSalary: hasSalary,
    salary: hasSalary
      ? {
        min: job.min_salary ? Number(job.min_salary) : undefined,
        max: job.max_salary ? Number(job.max_salary) : undefined,
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
    educationLevel: job.education_levels ? [String(job.education_levels)] : [],
    mandatoryCertifications: (job.mandatory_certifications ?? []).map((item) =>
      String(item.id),
    ),
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
  const [submitted, setSubmitted] = useState(false);
  const [createdJobId, setCreatedJobId] = useState<number | null>(null);
  const [reviewJob, setReviewJob] = useState<JobDetails | null>(null);
  const [formHydrated, setFormHydrated] = useState(false);

  const { data: session } = useSession();
  const token = session?.accessToken || "";
  const router = useRouter();
  const queryClient = useQueryClient();

  // ─── Mutations ─────────────────────────────────────────
  const { mutateAsync: postStepOne, isPending: isPostingStepOne } = usePostStepOne({ token });
  const { mutateAsync: postStepTwo, isPending: isPostingStepTwo } = usePostStepTwo({ token });
  const { mutateAsync: postStepThree, isPending: isPostingStepThree } = usePostStepThree({ token });
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

  const { handleSubmit, trigger, getValues, reset } = methods;

  // ─── Hydrate form when existing job arrives ───────────
  useEffect(() => {
    if (existingJob && !formHydrated) {
      const mappedData = mapJobToFormData(existingJob);
      reset({ ...jobFormDefaults, ...mappedData } as JobFormData);
      setReviewJob(existingJob);

      // In complete mode, set the createdJobId so step-by-step flow works
      if (mode === "complete") {
        setCreatedJobId(existingJob.id);
      }

      setFormHydrated(true);
    }
  }, [existingJob, formHydrated, mode, reset]);

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

    const stepThreeData = stepThreeResponse.data as Record<string, any>;
    const nextReviewJob =
      stepThreeData?.data?.job ??
      stepThreeData?.job ??
      null;

    if (nextReviewJob) {
      setReviewJob(nextReviewJob as JobDetails);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await submitStepThreeStatus("draft");
      setSaveDraftOpen(false);
      setSaveSuccessOpen(true);
    } catch {
      // errors are already handled in mutation onError toast
    }
  };

  // ─── Build edit payload from form values ──────────────
  const buildStepOnePayload = (data: JobFormData) => {
    const basePayload = {
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
      mandatory_certifications: (data.mandatoryCertifications ?? []).map((item) =>
        Number(item),
      ),
      education_levels: (data.educationLevel ?? []).map((item) => Number(item)),
      availability_id: Number(data.availability),
    };

    if (!data.addSalary) {
      return basePayload;
    }

    return {
      ...basePayload,
      min_salary: Number(data.salary?.min),
      max_salary: Number(data.salary?.max),
      currency_id: Number(data.salary?.currency),
      salary_type_id: Number(data.salary?.type),
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
      mandatory_certifications: (data.mandatoryCertifications ?? []).map((item) =>
        Number(item),
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
      min_salary: Number(data.salary?.min),
      max_salary: Number(data.salary?.max),
      currency_id: Number(data.salary?.currency),
      salary_type_id: Number(data.salary?.type),
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
    const valid = await trigger(fields);
    if (!valid) return;

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
      // In complete mode, use the existing job id (no new step-one API call needed
      // if the job already exists from a previous draft)
      if (mode === "complete" && createdJobId) {
        // For complete mode, we still call step-one to save the updated data
        const data = getValues();

        await postStepOne(buildStepOnePayload(data));
        setCurrentStep((s) => s + 1);
        return;
      }

      // Create mode — call step-one to create the job
      const data = getValues();
      const stepOneResponse = await postStepOne(buildStepOnePayload(data));

      const stepOneData = stepOneResponse.data as Record<string, any>;
      const nextCreatedJobId = Number(stepOneData?.data?.job?.id);

      if (!nextCreatedJobId) {
        throw new Error("Unable to resolve created job id from step one response.");
      }

      setCreatedJobId(nextCreatedJobId);
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
      const stepTwoData = stepTwoResponse.data as Record<string, any>;
      const nextReviewJob =
        stepTwoData?.data?.job ??
        stepTwoData?.job ??
        null;
      setReviewJob(nextReviewJob as JobDetails | null);
      setCurrentStep((s) => s + 1);
      return;
    }

    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => setCurrentStep((s) => s - 1);

  // ─── Final submit for create/complete mode ────────────
  const onSubmitCreateOrComplete: SubmitHandler<JobFormData> = async () => {
    setIsSubmitting(true);
    try {
      await submitStepThreeStatus("open");
      setSubmitted(true);
      setPostSuccess(true);
      router.push("/company/job-management");
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
      router.push("/company/job-management");
      queryClient.invalidateQueries({ queryKey: ['company-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['company-job', existingJobId] });
    } catch {
      // errors are already handled in mutation onError toast
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Loading gate ─────────────────────────────────────
  if ((mode === "complete" || mode === "edit") && isLoadingJob) {
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
  const isBusy = isPostingStepOne || isPostingStepTwo || isPostingStepThree || isUpdatingJob;

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
              {currentStep === 0 && <JobPostStepOne />}
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
                  disabled={isBusy}
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
                  disabled={isSubmitting || isBusy}
                  variant="secondary"
                  size="pill"
                  hoverStyle="slidePrimary"
                  className="w-1/6"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
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
