import AboutSection from "@/features/candidate-profile/components/about/AboutSection"
import EducationSection from "@/features/candidate-profile/components/education/EducationSection"
import { ExperienceSection } from "@/features/candidate-profile/components/experience/ExperienceSection"
import SideContentInfos from "@/features/candidate-profile/components/SideContentInfos"
import SkillsSection from "@/features/candidate-profile/components/skills/SkillsSection"

const CandidateProfilePage = () => {
    return (
        <main className="grid grid-cols-12 gap-8 items-start w-full">

            <section className="col-span-8 flex flex-col gap-4"
            >
                <AboutSection />
                <EducationSection />
                <SkillsSection />
                <ExperienceSection />
            </section>

            <section className="col-span-4">
                <SideContentInfos />
            </section>

        </main>
    )
}

export default CandidateProfilePage
