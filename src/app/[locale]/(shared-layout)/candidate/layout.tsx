import CandidateBreadcrumb from '@/features/candidate-profile/components/CandidateBreadcrumb';
import CandidateLayoutColumns from '@/features/candidate-profile/components/CandidateLayoutColumns';
import CandidateSideContentLinks from '@/features/candidate-profile/components/SideContentLinks';
import { getCandidateProfile } from '@/features/candidate-profile/services/profile-service';

export default async function CandidateProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCandidateProfile();
  return (
    <section className="min-h-dvh bg-body-bg">
      <CandidateBreadcrumb />
      <main className="layout-shell pb-12">
        <section className="layout-content">
          <CandidateLayoutColumns
            sidebar={
              <CandidateSideContentLinks
                isCompleted={profile?.isProfileComplete}
              />
            }
          >
            {children}
          </CandidateLayoutColumns>
        </section>
      </main>
    </section>
  );
}
