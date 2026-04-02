import AboutSection from "@/features/candidate-profile/components/about/AboutSection";
import EducationSection from "@/features/candidate-profile/components/education/EducationSection";
import { ExperienceSection } from "@/features/candidate-profile/components/experience/ExperienceSection";
import SideContentInfos from "@/features/candidate-profile/components/SideContentInfos";
import SkillsSection from "@/features/candidate-profile/components/skills/SkillsSection";

const CandidateProfilePage = () => {
  return (
    <main className="grid w-full grid-cols-12 items-start gap-4">
      <section className="col-span-12 flex flex-col gap-4 lg:col-span-8">
        <AboutSection />
        <EducationSection />
        <SkillsSection />
        <ExperienceSection />
      </section>

      <section className="col-span-12 max-lg:-order-1 lg:col-span-4">
        <SideContentInfos />
      </section>
    </main>
  );
};

export default CandidateProfilePage;
