import { z } from "zod";

export const aboutModalSchema = z.object({
  bio: z
    .string()
    .trim()
    .max(1000, "Bio must be at most 1000 characters.")
    .refine(
      (value) => {
        const words = value
          .trim()
          .split(/\s+/)
          .filter(Boolean);

        return words.length >= 50;
      },
      {
        message: "Please provide at least 50 words",
      }
    ),
});

export type AboutModalFormData = z.infer<typeof aboutModalSchema>;
