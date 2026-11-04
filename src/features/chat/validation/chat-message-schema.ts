import { z } from 'zod';
import { MAX_MESSAGE_LENGTH } from '../constants';

export function createChatMessageSchema(messages: { tooLong: string }) {
  return z.object({
    text: z.string().max(MAX_MESSAGE_LENGTH, messages.tooLong),
    attachments: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        kind: z.enum(['image', 'file']),
        size: z.string(),
        url: z.string().optional(),
      }),
    ),
  });
}

export type ChatMessageFormValues = z.infer<
  ReturnType<typeof createChatMessageSchema>
>;
