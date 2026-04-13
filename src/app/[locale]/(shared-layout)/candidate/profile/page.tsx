import AboutSection from "@/features/candidate-profile/components/about/AboutSection";
import EducationSection from "@/features/candidate-profile/components/education/EducationSection";
import { ExperienceSectionData } from "@/features/candidate-profile/components/experience/ExperienceSectionData";
import SideContentInfos from "@/features/candidate-profile/components/SideContentInfos";
import SkillsSection from "@/features/candidate-profile/components/skills/SkillsSection";
import { getCandidateProfile } from "@/features/candidate-profile/services/profile-service";

const CandidateProfilePage = async () => {
  const profile = await getCandidateProfile();

  return (
    <main className="grid w-full grid-cols-12 items-start gap-4">
      <section className="col-span-12 flex flex-col gap-4 lg:col-span-8">
        <AboutSection profile={profile} />
        <EducationSection profile={profile} />
        <SkillsSection profile={profile} />
        <ExperienceSectionData profile={profile} />
      </section>

      <section className="col-span-12 max-lg:-order-1 lg:col-span-4">
        <SideContentInfos profile={profile} />
      </section>
    </main>
  );
};

export default CandidateProfilePage;
