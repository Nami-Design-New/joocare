import { z } from "zod";

export const aboutModalSchema = z.object({
  bio: z
    .string()
    .trim()
    .min(50, "Please provide a minimum of 50 words")
    .max(1000, "Bio must be at most 1000 characters.")
    .refine((value) => value.length === 0 || value.length >= 50, {
      message: "Please provide a minimum of 50 words",
    }),
});

export type AboutModalFormData = z.infer<typeof aboutModalSchema>;
