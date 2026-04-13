import CandidateSideContentLinks from "@/features/candidate-profile/components/SideContentLinks";
import { getCandidateProfile } from "@/features/candidate-profile/services/profile-service";
import PlainBreadcrumb from "@/shared/components/PlainBreadcramb";

export default async function CandidateProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCandidateProfile();
  return (
    <section className="bg-body-bg min-h-dvh">
      <PlainBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Overview" }]}
      />
      <main className="layout-shell pb-12">
        <section className="layout-content">
          {" "}
          <section className="mt-4 grid grid-cols-12 items-start gap-4 lg:mt-6">
            <section className="col-span-12 lg:col-span-3">
              <CandidateSideContentLinks isCompleted={profile?.isProfileComplete} />
            </section>

            <section className="col-span-12 lg:col-span-9">{children}</section>
          </section>
        </section>
      </main>
    </section>
  );
}
