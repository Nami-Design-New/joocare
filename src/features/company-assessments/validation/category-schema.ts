import { z } from 'zod';

type CategoryMessages = {
  nameRequired: string;
  descriptionRequired: string;
};

export function createCategorySchema(messages: CategoryMessages) {
  return z.object({
    name: z.string().trim().min(1, messages.nameRequired),
    description: z.string().trim().min(1, messages.descriptionRequired),
  });
}
