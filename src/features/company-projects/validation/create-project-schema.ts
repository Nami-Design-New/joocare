import { z } from 'zod';
import { PROJECT_NAME_MAX_LENGTH } from '../constants/project-preview-data';

type CreateProjectMessages = {
  nameRequired: string;
  nameTooLong: string;
};

export const createCreateProjectSchema = (messages: CreateProjectMessages) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, messages.nameRequired)
      .max(PROJECT_NAME_MAX_LENGTH, messages.nameTooLong),
  });

export type TCreateProjectSchema = z.infer<
  ReturnType<typeof createCreateProjectSchema>
>;
