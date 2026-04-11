import CandidateApplicationsList from "@/features/jobs/components/candidate/CandidateApplicationsList";
import { getApplications } from "@/features/jobs/services/applications-service";

export default async function CandidateApplicationsPage({
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
  const applications = await getApplications(
    Number.isNaN(page) || page < 1 ? 1 : page,
    locale,
  );

  return (
    <CandidateApplicationsList
      applications={applications.data}
      currentPage={applications.current_page}
      totalItems={applications.total}
      pageSize={applications.per_page}
      locale={locale}
    />
  );
}
