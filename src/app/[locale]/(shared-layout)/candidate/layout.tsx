import CandidateSideContentLinks from "@/features/candidate-profile/components/SideContentLinks";
import PlainBreadcrumb from "@/shared/components/PlainBreadcramb";

export default function CandidateProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-body-bg min-h-dvh">
      <PlainBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Overview" }]}
      />
      <main className="px-3 pb-12 lg:px-25">
        <section className="container mx-auto">
          {" "}
          <section className="mt-4 grid grid-cols-12 items-start gap-4 lg:mt-6">
            <section className="col-span-12 lg:col-span-3">
              <CandidateSideContentLinks />
            </section>

            <section className="col-span-12 lg:col-span-9">{children}</section>
          </section>
        </section>
      </main>
    </section>
  );
}
