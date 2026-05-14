import { z } from "zod";

type AboutSchemaMessages = {
  bioMax: string;
  bioMinWords: string;
};

export const createAboutModalSchema = (messages: AboutSchemaMessages) => z.object({
  bio: z
    .string()
    .trim()
    .max(1000, messages.bioMax)
    .refine(
      (value) => {
        const words = value
          .trim()
          .split(/\s+/)
          .filter(Boolean);

        return words.length >= 50;
      },
      {
        message: messages.bioMinWords,
      }
    ),
});

export const aboutModalSchema = createAboutModalSchema({
  bioMax: "Bio must be at most 1000 characters.",
  bioMinWords: "Please provide at least 50 words",
});

export type AboutModalFormData = z.infer<typeof aboutModalSchema>;
