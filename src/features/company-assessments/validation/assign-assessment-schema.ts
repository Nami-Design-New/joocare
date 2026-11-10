import { z } from 'zod';

type AssignAssessmentMessages = {
  categoryRequired: string;
  assessmentRequired: string;
};

export const createAssignAssessmentSchema = (
  messages: AssignAssessmentMessages,
) =>
  z.object({
    categoryId: z.string().min(1, messages.categoryRequired),
    assessmentId: z.string().min(1, messages.assessmentRequired),
  });

export type TAssignAssessmentSchema = z.infer<
  ReturnType<typeof createAssignAssessmentSchema>
>;
