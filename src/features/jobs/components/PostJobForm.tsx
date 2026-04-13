"use client";

import WizardProgress from "@/features/complete-account/components/wizard-progress";
import AlertModal from "@/shared/components/modals/AlertModal";
import SuccessModal from "@/shared/components/modals/SuccessModal";
import { Button } from "@/shared/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import {
  JobFormData,
  jobFormDefaults,
  jobFormSchema,
  StepIndex,
  stepSchemas,
} from "../validation/job-post-schema";
import { usePostStepOne } from "../hooks/usePostStepOne";
import { usePostStepTwo } from "../hooks/usePostStepTwo";
import JobPostStepOne from "./JobPostStepOne";
import JobPostStepTwo from "./JobPostStepTwo";
import JobReviewPanel from "./JobReviewPanel";
const STEPS = ["Job Details", "Job Description & Requirements", "Job Preview"];
const LAST_STEP = STEPS.length - 1;

export default function PostJobForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdJobId, setCreatedJobId] = useState<number | null>(null);
  const { data: session } = useSession();
  const token = session?.accessToken || "";
  const { mutateAsync: postStepOne, isPending: isPostingStepOne } = usePostStepOne({
    token,
  });
  const { mutateAsync: postStepTwo, isPending: isPostingStepTwo } = usePostStepTwo({
    token,
  });
  // inside PostJobForm
  const [saveDraftOpen, setSaveDraftOpen] = useState(false);
  const [saveSuccessOpen, setSaveSuccessOpen] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const handleSaveDraft = async () => {
    // your save draft logic
    // await saveDraft(getValues());  

    setSaveDraftOpen(false);
    setSaveSuccessOpen(true);
  };
  const methods = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: jobFormDefaults,
    mode: "onChange",
  });

  const { handleSubmit, trigger, getValues } = methods;

  const handleNext = async () => {
    const fields = Object.keys(
      stepSchemas[currentStep as StepIndex].shape,
    ) as (keyof JobFormData)[];
    const valid = await trigger(fields);
    if (!valid) return;

    if (currentStep === 0) {
      const data = getValues();
      const stepOneResponse = await postStepOne({
        job_title_id: data.title === "__other__" ? undefined : Number(data.title),
        title: data.title === "__other__" ? data.otherJobTitle?.trim() ?? "" : undefined,
        professional_license: data.license,
        has_salary: data.addSalary,
        min_salary: Number(data.salary?.min ?? 0),
        max_salary: Number(data.salary?.max ?? 0),
        currency_id: Number(data.salary?.currency ?? 0),
        salary_type_id: Number(data.salary?.type ?? 0),
        category_id: Number(data.category),
        specialty_id: Number(data.specialty),
        employment_type_id: Number(data.employmentType),
        role_category_id: Number(data.roleCategory),
        seniority_level_id: Number(data.seniorityLevel || 0),
        country_id: Number(data.country),
        city_id: Number(data.city),
        experience_id: Number(data.yearsOfExperience),
        mandatory_certifications: data.mandatoryCertifications
          ? [Number(data.mandatoryCertifications)]
          : [],
        eduction_level_id: Number(data.educationLevel),
        availability_id: Number(data.availability),
      });

      console.log(stepOneResponse);

      const nextCreatedJobId = Number(
        stepOneResponse.data?.data?.job?.id ??
        stepOneResponse.data?.job?.id ??
        stepOneResponse.data?.data?.id ??
        stepOneResponse.data?.id,
      );

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

      await postStepTwo({
        jobId: effectiveJobId,
        payload: {
          description: data.description,
          skills: (data.skills ?? []).map((skillId) => Number(skillId)),
        },
      });
      setCurrentStep((s) => s + 1);
      return;
    }

    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => setCurrentStep((s) => s - 1);

  const onSubmit: SubmitHandler<JobFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      setSubmitted(true);
      setPostSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="h-min-dvh mx-auto max-w-7xl py-12">
      <div className="h-full rounded-2xl bg-white p-6">
        <div className="flex gap-6">
          <WizardProgress step={currentStep} steps={STEPS} />
          {currentStep > 0 && (
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
              {currentStep === 2 && <JobReviewPanel data={getValues()} />}
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
                  disabled={isPostingStepOne || isPostingStepTwo}
                  variant="secondary"
                  hoverStyle="slidePrimary"
                  size="pill"
                  className="w-1/6"
                >
                  {isPostingStepOne || isPostingStepTwo ? "Saving..." : "Next"}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
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
                      Posting...
                    </>
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
        title="Your advertisement has been successfully published!"
        description="Your advertisement is now available to thousands of medical professionals on the platform. We will notify you as soon as any suitable candidates apply. You can track statistics and applicant interactions through the dashboard."
      />
    </section>
  );
}
