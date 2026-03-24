import AboutSection from "@/features/candidate-profile/components/AboutSection"
import EducationSection from "@/features/candidate-profile/components/education/EducationSection"
import SkillsSection from "@/features/candidate-profile/components/skills/SkillsSection"

const CandidateProfilePage = () => {
    return (
        <main className="flex flex-col gap-4">
            <AboutSection />
            <EducationSection />
            <SkillsSection />
        </main>
    )
}

export default CandidateProfilePage
