import {
  assessmentSeeds,
  categorySeeds,
} from '@/features/company-assessments/constants/assessment-data';
import type { AssessmentSource } from '@/features/company-assessments/types/assessment.types';

const LIBRARIES: AssessmentSource[] = ['joocare', 'company'];

// Library → category → assessment options for linking an assessment to a job.
// Preview seeds until the assessments API exists.
export function useAssessmentOptions(source?: string, categoryId?: string) {
  const categoryOptions = categorySeeds
    .filter((category) => category.source === source)
    .map((category) => ({ value: category.id, label: category.name }));
  const assessmentOptions = assessmentSeeds
    .filter(
      (assessment) =>
        assessment.categoryId === categoryId && !assessment.pausedAt,
    )
    .map((assessment) => ({ value: assessment.id, label: assessment.title }));

  return { libraryOptions: LIBRARIES, categoryOptions, assessmentOptions };
}
