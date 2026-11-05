import CandidateBreadcrumb from "@/features/candidate-profile/components/CandidateBreadcrumb";
import CandidateSideContentLinks from "@/features/candidate-profile/components/SideContentLinks";
import { getCandidateProfile } from "@/features/candidate-profile/services/profile-service";

export default async function CandidateProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCandidateProfile();
  return (
    <section className="bg-body-bg min-h-dvh">
      <CandidateBreadcrumb />
      <main className="layout-shell pb-12">
        <section className="layout-content">
          <section className="mt-4 grid grid-cols-12 gap-4 lg:mt-6 lg:items-stretch">
            <section className="col-span-12 lg:col-span-3 lg:h-full">
              <CandidateSideContentLinks isCompleted={profile?.isProfileComplete} />
            </section>

            <section className="col-span-12 lg:col-span-9 lg:min-w-0">
              {children}
            </section>
          </section>
        </section>
      </main>
    </section>
  );
}
