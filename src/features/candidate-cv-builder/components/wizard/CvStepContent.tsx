import type { ComponentType } from 'react';
import type { CvBuilderStepKey } from '../../types/cv-builder.types';
import CertificatesStep from '../steps/CertificatesStep';
import ConferencesStep from '../steps/ConferencesStep';
import ContactInfoStep from '../steps/ContactInfoStep';
import EducationStep from '../steps/EducationStep';
import WorkExperienceStep from '../steps/experience/WorkExperienceStep';
import JobProfileStep from '../steps/JobProfileStep';
import PersonalDetailsStep from '../steps/PersonalDetailsStep';
import ProfessionalSummaryStep from '../steps/ProfessionalSummaryStep';
import ResearchStep from '../steps/ResearchStep';
import SkillsStep from '../steps/SkillsStep';

const STEP_COMPONENTS: Record<CvBuilderStepKey, ComponentType> = {
  personal: PersonalDetailsStep,
  contact: ContactInfoStep,
  jobProfile: JobProfileStep,
  summary: ProfessionalSummaryStep,
  educations: EducationStep,
  certificates: CertificatesStep,
  experience: WorkExperienceStep,
  skills: SkillsStep,
  research: ResearchStep,
  conferences: ConferencesStep,
};

// Renders the fields of the current wizard step.
export default function CvStepContent({ step }: { step: CvBuilderStepKey }) {
  const Step = STEP_COMPONENTS[step];
  return <Step />;
}
