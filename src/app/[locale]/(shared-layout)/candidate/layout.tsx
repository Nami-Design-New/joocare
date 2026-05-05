import CandidateSideContentLinks from "@/features/candidate-profile/components/SideContentLinks";
import { getCandidateProfile } from "@/features/candidate-profile/services/profile-service";
import PlainBreadcrumb from "@/shared/components/PlainBreadcramb";
import { getTranslations } from "next-intl/server";

export default async function CandidateProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCandidateProfile();
  const tCommon = await getTranslations("Common");
  const tCandidate = await getTranslations("Candidate");
  return (
    <section className="bg-body-bg min-h-dvh">
      <PlainBreadcrumb
        items={[{ label: tCommon("home"), href: "/" }, { label: tCandidate("overview") }]}
      />
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
