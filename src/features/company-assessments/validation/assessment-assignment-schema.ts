import { z } from 'zod';

export function createAssessmentAssignmentSchema(message: string) {
  return z
    .object({
      assessmentId: z.string().regex(/^[1-9]\d*$/, message),
      userIds: z.array(z.string().regex(/^[1-9]\d*$/, message)),
      emails: z.array(z.email(message)),
    })
    .refine(
      ({ userIds, emails }) => userIds.length + emails.length > 0,
      message,
    );
}

export const assignmentCandidatesPageSchema = z.object({
  data: z.array(
    z.object({
      id: z.number().int().positive().transform(String),
      name: z.string(),
      email: z.string(),
      country: z.string().nullable(),
      image: z.string().nullable(),
    }),
  ),
  next_page_url: z.string().nullable(),
});
