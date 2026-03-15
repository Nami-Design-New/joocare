// "use client";

// import WizardProgress from "@/features/complete-account/components/wizard-progress";
// import { useRouter } from "@/i18n/navigation";
// import { Button } from "@/shared/components/ui/button";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
// import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// import {
//   JobFormData,
//   jobFormDefaults,
//   jobFormSchema,
//   StepIndex,
//   stepSchemas,
// } from "../validation/job-post-schema";
// import JobPostStepOne from "./JobPostStepOne";
// import JobPostStepTwo from "./JobPostStepTwo";
// import JobReviewPanel from "./JobReviewPanel";

// const POST_JOB_FORM_STEPS = [
//   "Job Details",
//   "Job Description & Requirements",
//   "Job Preview",
// ];

// export default function PostJobForm() {
//   const router = useRouter();
//   // Replace with useSearchParams() in real Next.js app
//   const [currentStep, setCurrentStep] = useState<number>(2);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);

//   const methods = useForm<JobFormData>({
//     resolver: zodResolver(jobFormSchema),
//     defaultValues: jobFormDefaults,
//     mode: "onChange",
//   });

//   const { handleSubmit, trigger, getValues } = methods;

//   const handleNext = async () => {
//     // Validate only current step's fields
//     console.log("next ");

//     const fieldsToValidate = Object.keys(
//       stepSchemas[currentStep as StepIndex].shape,
//     );
//     console.log(fieldsToValidate);

//     const valid = await trigger(fieldsToValidate as (keyof JobFormData)[]);
//     console.log(valid);
//     if (valid) setCurrentStep((s) => s + 1);
//   };

//   const handleBack = () => setCurrentStep((s) => s - 1);

//   const onSubmit: SubmitHandler<JobFormData> = async (data) => {
//     setIsSubmitting(true);
//     try {
//       // Replace with your API call
//       await new Promise((res) => setTimeout(res, 1500));
//       console.log("Submitted:", data);

//       setSubmitted(true);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (submitted) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
//         <div className="max-w-md rounded-2xl bg-white p-10 text-center shadow-lg">
//           <div className="mb-4 text-5xl">🎉</div>
//           <h2 className="mb-2 text-2xl font-bold text-gray-800">Job Posted!</h2>
//           <p className="mb-6 text-gray-500">
//             Your listing is now live and visible to candidates.
//           </p>
//           <button
//             onClick={() => {
//               setSubmitted(false);
//               setCurrentStep(0);
//             }}
//             className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white transition hover:bg-green-700"
//           >
//             Post Another Job
//           </button>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <section className="h-min-dvh mx-auto max-w-7xl py-12">
//       <div className="h-full rounded-2xl bg-white p-6">
//         <div className="flex gap-6">
//           <WizardProgress step={currentStep} steps={POST_JOB_FORM_STEPS} />{" "}
//           {currentStep > 0 && (
//             <Button variant="outline" size="pill" hoverStyle="slidePrimary">
//               Save as Draft
//             </Button>
//           )}
//         </div>
//         <FormProvider {...methods}>
//           <form onSubmit={handleSubmit(onSubmit)} noValidate>
//             <div className="min-h-80">
//               {currentStep === 0 && <JobPostStepOne />}
//               {currentStep === 1 && <JobPostStepTwo />}
//               {currentStep === 2 && <JobReviewPanel data={getValues()} />}
//             </div>{" "}
//             <div className="mt-5 flex w-full items-center justify-center gap-6">
//               {currentStep > 0 && (
//                 <Button
//                   type="button"
//                   onClick={handleBack}
//                   disabled={currentStep === 0}
//                   variant="outline"
//                   hoverStyle="slidePrimary"
//                   size="pill"
//                   className="w-1/6"
//                 >
//                   Prev
//                 </Button>
//               )}

//               {currentStep < POST_JOB_FORM_STEPS.length - 1 ? (
//                 <Button
//                   type="button"
//                   onClick={handleNext}
//                   variant="secondary"
//                   hoverStyle="slidePrimary"
//                   size="pill"
//                   className="w-1/6"
//                 >
//                   Next
//                 </Button>
//               ) : (
//                 <Button
//                   type="submit"
//                   disabled={isSubmitting}
//                   variant="secondary"
//                   size="pill"
//                   hoverStyle="slidePrimary"
//                   className="w-1/6"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <svg
//                         className="h-4 w-4 animate-spin"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8v8H4z"
//                         />
//                       </svg>
//                       Posting...
//                     </>
//                   ) : (
//                     "Confirm & Post Job"
//                   )}
//                 </Button>
//               )}
//             </div>
//           </form>
//         </FormProvider>
//       </div>
//     </section>
//   );
// }
"use client";

import WizardProgress from "@/features/complete-account/components/wizard-progress";
import { Button } from "@/shared/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  JobFormData,
  jobFormDefaults,
  jobFormSchema,
  StepIndex,
  stepSchemas,
} from "../validation/job-post-schema";
import JobPostStepOne from "./JobPostStepOne";
import JobPostStepTwo from "./JobPostStepTwo";
import JobReviewPanel from "./JobReviewPanel";
import AlertModal from "@/shared/components/modals/AlertModal";
import SuccessModal from "@/shared/components/modals/SuccessModal";

const STEPS = ["Job Details", "Job Description & Requirements", "Job Preview"];
const LAST_STEP = STEPS.length - 1;

export default function PostJobForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    if (valid) setCurrentStep((s) => s + 1);
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
                  variant="secondary"
                  hoverStyle="slidePrimary"
                  size="pill"
                  className="w-1/6"
                >
                  Next
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
