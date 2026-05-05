import { Suspense } from "react";
import PostJobForm from "@/features/jobs/components/PostJobForm";
import Header from "@/shared/components/header/Header";
import { JobPostStepOneSkeleton } from "@/features/jobs/components/JobPostStepOneSkeleton";

export default function page() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <section className="h-min-dvh mx-auto max-w-7xl py-12">
            <JobPostStepOneSkeleton hasSteps={true} />
          </section>
        }
      >
        <PostJobForm />
      </Suspense>
    </>
  );
}
