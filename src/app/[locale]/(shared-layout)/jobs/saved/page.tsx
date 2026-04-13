import SavedJobsList from "@/features/jobs/components/candidate/SavedJobsList";
import { getSavedJobs } from "@/features/jobs/services/saved-jobs-service";
import PlainBreadcrumb from "@/shared/components/PlainBreadcramb";

export default async function page({
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
  const savedJobs = await getSavedJobs(
    Number.isNaN(page) || page < 1 ? 1 : page,
    locale,
  );

  return (
    <>
      <PlainBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Saved" }]}
      />
      <section className="px-3 lg:px-25">
        <div className="container mx-auto">
          <SavedJobsList
            jobs={savedJobs.data}
            currentPage={savedJobs.current_page}
            totalItems={savedJobs.total}
            pageSize={savedJobs.per_page}
            locale={locale}
          />
        </div>
      </section>
    </>
  );
}
