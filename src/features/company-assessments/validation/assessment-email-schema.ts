import { z } from 'zod';

export const createAssessmentEmailSchema = (message: string) =>
  z.object({ email: z.string().trim().email(message) });
