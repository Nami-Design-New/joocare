import type { z } from 'zod';
import type {
  assessmentDetailsSchema,
  assessmentAttemptSchema,
  assessmentAnswerSchema,
} from '../validation/candidate-assessment-schema';

export type AssessmentDetails = z.infer<typeof assessmentDetailsSchema>;
export type AssessmentAttempt = z.infer<typeof assessmentAttemptSchema>;
export type AssessmentAnswer = z.infer<typeof assessmentAnswerSchema>;
export type AssessmentRequestOptions = { token: string; locale: string };
