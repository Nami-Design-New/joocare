import AboutSection from '@/features/candidate-profile/components/about/AboutSection';
import ProfileTabs from '@/features/candidate-profile/components/ProfileTabs';
import EducationSection from '@/features/candidate-profile/components/education/EducationSection';
import { ExperienceSectionData } from '@/features/candidate-profile/components/experience/ExperienceSectionData';
import SideContentInfos from '@/features/candidate-profile/components/SideContentInfos';
import SkillsSection from '@/features/candidate-profile/components/skills/SkillsSection';
import { getCandidateProfile } from '@/features/candidate-profile/services/profile-service';
import { getProfessionalProfile } from '@/features/candidate-profile/services/profile-taxonomy-service';

const CandidateProfilePage = async () => {
  const profile = await getCandidateProfile();
  const professional = await getProfessionalProfile(profile);

  return (
    <main className="grid w-full grid-cols-12 items-start gap-4">
      <section className="col-span-12 flex flex-col gap-4 lg:col-span-8">
        <ProfileTabs />
        <AboutSection profile={profile} />
        <EducationSection profile={profile} />
        <SkillsSection profile={profile} />
        <ExperienceSectionData profile={profile} />
      </section>

      <section className="col-span-12 max-lg:-order-1 lg:col-span-4">
        <SideContentInfos profile={profile} professional={professional} />
      </section>
    </main>
  );
};

export default CandidateProfilePage;
