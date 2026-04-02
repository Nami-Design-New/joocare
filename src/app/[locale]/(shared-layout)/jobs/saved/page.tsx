import SavedJobsList from "@/features/jobs/components/candidate/SavedJobsList";
import PlainBreadcrumb from "@/shared/components/PlainBreadcramb";

export default function page() {
  return (
    <>
      <PlainBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Saved" }]}
      />
      <section className="px-3 lg:px-25">
        <div className="container mx-auto">
          <SavedJobsList />
        </div>
      </section>
    </>
  );
}
