import { z } from 'zod';

export const createAssessmentNoteSchema = (requiredMessage: string) =>
  z.object({ text: z.string().trim().min(1, requiredMessage) });
