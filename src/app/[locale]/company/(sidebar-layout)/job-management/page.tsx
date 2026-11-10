import { Suspense } from "react";
import JobManagementSection from "@/features/jobs/components/JobManagementSection";

export default async function Page() {
  return (
    <section className="flex flex-col gap-6 sm:gap-12">
      <Suspense>
        <JobManagementSection />
      </Suspense>
    </section>
  );
}
