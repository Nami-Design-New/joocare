import JobManagementSection from "@/features/jobs/components/JobManagementSection";
import { getJobManagementService } from "@/features/jobs/services/job-management-service";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const pageParam = resolvedSearchParams.page;
  const page =
    typeof pageParam === "string"
      ? Number.parseInt(pageParam, 10)
      : Array.isArray(pageParam) && pageParam[0]
        ? Number.parseInt(pageParam[0], 10)
        : 1;
  const jobsData = await getJobManagementService(
    Number.isNaN(page) || page < 1 ? 1 : page,
    locale,
  );

  return (
    <section className="flex flex-col gap-12">
      <JobManagementSection
        jobData={jobsData?.data}
        currentPage={jobsData.current_page}
        totalItems={jobsData.total}
        pageSize={jobsData.per_page}
        locale={locale}
      />
    </section>
  );
}
