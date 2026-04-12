import JobManagementSection from "@/features/jobs/components/JobManagementSection";

export default async function Page() {
  return (
    <section className="flex flex-col gap-12">
      <JobManagementSection />
    </section>
  );
}
