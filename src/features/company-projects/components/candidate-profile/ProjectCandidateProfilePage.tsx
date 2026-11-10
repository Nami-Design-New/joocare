import AboutSection from '@/features/candidate-profile/components/about/AboutSection';
import EducationSection from '@/features/candidate-profile/components/education/EducationSection';
import { ExperienceSectionData } from '@/features/candidate-profile/components/experience/ExperienceSectionData';
import SkillsSection from '@/features/candidate-profile/components/skills/SkillsSection';
import type { ProjectCandidateProfile } from '../../types/candidate-profile.types';
import CandidateCredentialsTabs from './CandidateCredentialsTabs';
import CandidateProfileSidebar from './CandidateProfileSidebar';
import CareerPreferencesSection from './CareerPreferencesSection';
import ClinicalPrivilegesSection from './ClinicalPrivilegesSection';

type ProjectCandidateProfilePageProps = {
  candidate: ProjectCandidateProfile;
};

export default function ProjectCandidateProfilePage({
  candidate,
}: ProjectCandidateProfilePageProps) {
  const { profile } = candidate;

  return (
    <div className="layout-container grid grid-cols-1 items-start gap-5 py-5 sm:gap-8 sm:py-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:py-12.5">
      <CandidateProfileSidebar profile={profile} summary={candidate.summary} />

      <div className="flex min-w-0 flex-col gap-4">
        <AboutSection profile={profile} readOnly />
        <CareerPreferencesSection preferences={candidate.careerPreferences} />
        <EducationSection profile={profile} readOnly />
        <SkillsSection profile={profile} readOnly />
        <ExperienceSectionData profile={profile} readOnly />
        <ClinicalPrivilegesSection privileges={candidate.clinicalPrivileges} />
        <CandidateCredentialsTabs
          qualifications={candidate.qualifications}
          certificates={candidate.certificates}
          licenses={candidate.licenses}
        />
      </div>
    </div>
  );
}
