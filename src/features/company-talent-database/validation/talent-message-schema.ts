import { z } from 'zod';

export function createTalentMessageSchema(messages: {
  required: string;
  tooLong: string;
}) {
  return z.object({
    message: z
      .string()
      .trim()
      .min(1, messages.required)
      .max(5000, messages.tooLong),
  });
}
